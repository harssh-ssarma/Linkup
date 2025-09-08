import openai
import torch
from transformers import (
    AutoTokenizer, AutoModelForCausalLM, 
    pipeline, AutoModel
)
from sentence_transformers import SentenceTransformer
from langchain.llms import OpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferWindowMemory
import chromadb
from django.conf import settings
import asyncio
import aiohttp
from typing import List, Dict, Any
import json
import time

class AIService:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Local models for privacy-sensitive operations
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis", 
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            device=0 if torch.cuda.is_available() else -1
        )
        
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Language detection
        self.language_detector = pipeline(
            "text-classification",
            model="papluca/xlm-roberta-base-language-detection"
        )
        
        # Translation
        self.translator = pipeline(
            "translation",
            model="facebook/mbart-large-50-many-to-many-mmt"
        )
        
        # Local LLM for privacy
        self.local_tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
        self.local_model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
        
        # Vector database
        self.chroma_client = chromadb.Client()
        
        # Conversation memory
        self.memory = ConversationBufferWindowMemory(k=10)

    async def chat_with_gpt(self, message: str, conversation_history: List[Dict] = None) -> Dict[str, Any]:
        """Chat with GPT-4 like ChatGPT"""
        start_time = time.time()
        
        messages = [
            {"role": "system", "content": "You are a helpful AI assistant integrated into a messaging app. Be conversational, helpful, and concise."}
        ]
        
        if conversation_history:
            messages.extend(conversation_history[-10:])  # Last 10 messages for context
        
        messages.append({"role": "user", "content": message})
        
        try:
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-4-turbo-preview",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            response_time = time.time() - start_time
            
            return {
                'response': response.choices[0].message.content,
                'tokens_used': response.usage.total_tokens,
                'response_time': response_time,
                'model': 'gpt-4-turbo-preview'
            }
        except Exception as e:
            # Fallback to local model
            return await self.chat_with_local_model(message)

    async def chat_with_local_model(self, message: str) -> Dict[str, Any]:
        """Fallback to local model for privacy"""
        start_time = time.time()
        
        # Encode the new user input, add the eos_token and return a tensor in Pytorch
        new_user_input_ids = self.local_tokenizer.encode(
            message + self.local_tokenizer.eos_token, 
            return_tensors='pt'
        )
        
        # Generate a response
        with torch.no_grad():
            chat_history_ids = self.local_model.generate(
                new_user_input_ids, 
                max_length=1000,
                num_beams=5,
                no_repeat_ngram_size=2,
                temperature=0.7,
                do_sample=True,
                pad_token_id=self.local_tokenizer.eos_token_id
            )
        
        # Decode the response
        response = self.local_tokenizer.decode(
            chat_history_ids[:, new_user_input_ids.shape[-1]:][0], 
            skip_special_tokens=True
        )
        
        response_time = time.time() - start_time
        
        return {
            'response': response,
            'tokens_used': len(chat_history_ids[0]),
            'response_time': response_time,
            'model': 'DialoGPT-medium'
        }

    def generate_smart_replies(self, message: str, conversation_context: List[str] = None) -> List[Dict[str, Any]]:
        """Generate smart reply suggestions"""
        context = " ".join(conversation_context[-5:]) if conversation_context else ""
        full_context = f"{context} {message}".strip()
        
        # Analyze sentiment first
        sentiment = self.analyze_sentiment(message)
        
        # Generate contextual replies
        if sentiment['label'] == 'POSITIVE':
            base_replies = ["That's great! 😊", "Awesome!", "Nice to hear that!"]
        elif sentiment['label'] == 'NEGATIVE':
            base_replies = ["I'm sorry to hear that 😔", "That's tough", "Hope things get better"]
        else:
            base_replies = ["I see", "Understood", "Thanks for sharing"]
        
        # Use AI to generate more contextual replies
        try:
            prompt = f"Generate 3 short, natural reply suggestions for this message: '{message}'"
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.8
            )
            
            ai_replies = response.choices[0].message.content.split('\n')
            ai_replies = [reply.strip('1234567890. ') for reply in ai_replies if reply.strip()]
            
            # Combine and score replies
            all_replies = base_replies + ai_replies[:3]
            
        except:
            all_replies = base_replies
        
        return [
            {
                'suggestion': reply,
                'confidence_score': 0.8 + (i * 0.05),
                'type': 'contextual'
            }
            for i, reply in enumerate(all_replies[:3])
        ]

    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze message sentiment"""
        result = self.sentiment_analyzer(text)[0]
        
        # Map labels to more readable format
        label_mapping = {
            'LABEL_0': 'NEGATIVE',
            'LABEL_1': 'NEUTRAL', 
            'LABEL_2': 'POSITIVE'
        }
        
        return {
            'label': label_mapping.get(result['label'], result['label']),
            'score': result['score'],
            'confidence': result['score']
        }

    def detect_language(self, text: str) -> Dict[str, str]:
        """Detect message language"""
        result = self.language_detector(text)[0]
        return {
            'language': result['label'],
            'confidence': result['score']
        }

    async def translate_message(self, text: str, target_language: str = 'en') -> Dict[str, Any]:
        """Translate message to target language"""
        try:
            # Detect source language first
            source_lang = self.detect_language(text)
            
            if source_lang['language'] == target_language:
                return {
                    'translated_text': text,
                    'source_language': source_lang['language'],
                    'target_language': target_language,
                    'confidence': 1.0
                }
            
            # Use OpenAI for better translation quality
            prompt = f"Translate this text to {target_language}: {text}"
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.3
            )
            
            return {
                'translated_text': response.choices[0].message.content,
                'source_language': source_lang['language'],
                'target_language': target_language,
                'confidence': 0.9
            }
            
        except Exception as e:
            # Fallback to local translation
            return {
                'translated_text': text,
                'source_language': 'unknown',
                'target_language': target_language,
                'confidence': 0.5,
                'error': str(e)
            }

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for semantic search"""
        return self.embedder.encode(texts).tolist()

    def semantic_search(self, query: str, messages: List[Dict], top_k: int = 5) -> List[Dict]:
        """Search messages semantically"""
        query_embedding = self.embedder.encode([query])
        message_texts = [msg['content'] for msg in messages]
        message_embeddings = self.embedder.encode(message_texts)
        
        # Calculate similarities
        similarities = torch.cosine_similarity(
            torch.tensor(query_embedding),
            torch.tensor(message_embeddings)
        )
        
        # Get top results
        top_indices = similarities.argsort(descending=True)[:top_k]
        
        return [
            {
                **messages[i],
                'similarity_score': similarities[i].item()
            }
            for i in top_indices
        ]

    async def moderate_content(self, text: str) -> Dict[str, Any]:
        """Moderate content for safety"""
        try:
            response = await asyncio.to_thread(
                self.openai_client.moderations.create,
                input=text
            )
            
            result = response.results[0]
            
            return {
                'flagged': result.flagged,
                'categories': dict(result.categories),
                'category_scores': dict(result.category_scores)
            }
        except:
            return {
                'flagged': False,
                'categories': {},
                'category_scores': {}
            }

# Singleton instance
ai_service = AIService()