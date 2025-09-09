import React, { useState, useEffect } from 'react';
import { FaRobot, FaLanguage, FaSmile, FaClock } from 'react-icons/fa';

interface SmartReply {
  id: string;
  text: string;
  type: 'quick' | 'contextual' | 'emoji' | 'translation';
  confidence: number;
  language?: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  language?: string;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'question';
}

interface SmartRepliesProps {
  messages: Message[];
  currentUserId: string;
  onSelectReply: (reply: string) => void;
  isVisible: boolean;
  userPreferences: {
    language: string;
    replyStyle: 'formal' | 'casual' | 'auto';
    enableTranslation: boolean;
    enableEmoji: boolean;
  };
}

const SmartReplies: React.FC<SmartRepliesProps> = ({
  messages,
  currentUserId,
  onSelectReply,
  isVisible,
  userPreferences
}) => {
  const [smartReplies, setSmartReplies] = useState<SmartReply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastProcessedMessageId, setLastProcessedMessageId] = useState<string>('');

  useEffect(() => {
    if (isVisible && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Only generate replies for messages from other users
      if (lastMessage.senderId !== currentUserId && lastMessage.id !== lastProcessedMessageId) {
        generateSmartReplies(messages.slice(-5)); // Use last 5 messages for context
        setLastProcessedMessageId(lastMessage.id);
      }
    }
  }, [messages, isVisible, currentUserId, lastProcessedMessageId]);

  const generateSmartReplies = async (recentMessages: Message[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/smart-replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: recentMessages,
          userPreferences,
          userId: currentUserId
        }),
      });

      const data = await response.json();
      setSmartReplies(data.replies);
    } catch (error) {
      console.error('Failed to generate smart replies:', error);
      // Fallback to basic replies
      generateFallbackReplies(recentMessages[recentMessages.length - 1]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackReplies = (lastMessage: Message) => {
    const fallbackReplies: SmartReply[] = [];
    const messageText = lastMessage.text.toLowerCase();

    // Basic pattern matching for common scenarios
    if (messageText.includes('how are you') || messageText.includes('how\'s it going')) {
      fallbackReplies.push(
        { id: '1', text: 'I\'m doing great, thanks!', type: 'quick', confidence: 0.8 },
        { id: '2', text: 'Pretty good, how about you?', type: 'quick', confidence: 0.8 },
        { id: '3', text: 'All good here! 😊', type: 'quick', confidence: 0.7 }
      );
    } else if (messageText.includes('thank')) {
      fallbackReplies.push(
        { id: '4', text: 'You\'re welcome!', type: 'quick', confidence: 0.9 },
        { id: '5', text: 'No problem!', type: 'quick', confidence: 0.8 },
        { id: '6', text: 'Happy to help! 😊', type: 'quick', confidence: 0.7 }
      );
    } else if (messageText.includes('?')) {
      fallbackReplies.push(
        { id: '7', text: 'Let me think about that', type: 'quick', confidence: 0.6 },
        { id: '8', text: 'Good question!', type: 'quick', confidence: 0.6 },
        { id: '9', text: 'I\'ll get back to you on that', type: 'quick', confidence: 0.6 }
      );
    } else {
      // General responses
      fallbackReplies.push(
        { id: '10', text: 'Got it!', type: 'quick', confidence: 0.5 },
        { id: '11', text: 'Sounds good!', type: 'quick', confidence: 0.5 },
        { id: '12', text: '👍', type: 'emoji', confidence: 0.6 }
      );
    }

    setSmartReplies(fallbackReplies);
  };

  const getReplyIcon = (type: SmartReply['type']) => {
    switch (type) {
      case 'translation':
        return <FaLanguage className="text-blue-500" />;
      case 'emoji':
        return <FaSmile className="text-yellow-500" />;
      case 'contextual':
        return <FaRobot className="text-green-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getReplyTypeLabel = (type: SmartReply['type']) => {
    switch (type) {
      case 'translation':
        return 'Translation';
      case 'emoji':
        return 'Emoji';
      case 'contextual':
        return 'Contextual';
      default:
        return 'Quick';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'border-green-200 bg-green-50';
    if (confidence >= 0.6) return 'border-yellow-200 bg-yellow-50';
    return 'border-gray-200 bg-gray-50';
  };

  if (!isVisible || smartReplies.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FaRobot className="text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Smart Replies</span>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          AI-powered suggestions
        </div>
      </div>

      <div className="space-y-2">
        {smartReplies.map((reply) => (
          <button
            key={reply.id}
            onClick={() => onSelectReply(reply.text)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${getConfidenceColor(reply.confidence)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getReplyIcon(reply.type)}
                  <span className="text-xs text-gray-500 font-medium">
                    {getReplyTypeLabel(reply.type)}
                  </span>
                  {reply.language && reply.language !== userPreferences.language && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {reply.language}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800">{reply.text}</p>
              </div>
              
              <div className="ml-2 flex flex-col items-end">
                <div className={`w-2 h-2 rounded-full ${
                  reply.confidence >= 0.8 ? 'bg-green-400' :
                  reply.confidence >= 0.6 ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-gray-400 mt-1">
                  {Math.round(reply.confidence * 100)}%
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Learning indicator */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        <FaRobot className="inline mr-1" />
        Smart replies improve as you use them
      </div>
    </div>
  );
};

// Advanced Smart Reply Settings Component
export const SmartRepliesSettings = ({
  preferences,
  onUpdatePreferences
}: {
  preferences: SmartRepliesProps['userPreferences'];
  onUpdatePreferences: (prefs: SmartRepliesProps['userPreferences']) => void;
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-4">Smart Replies Settings</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reply Style
          </label>
          <select
            value={preferences.replyStyle}
            onChange={(e) => onUpdatePreferences({
              ...preferences,
              replyStyle: e.target.value as 'formal' | 'casual' | 'auto'
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="auto">Auto (Matches conversation tone)</option>
            <option value="casual">Casual & Friendly</option>
            <option value="formal">Formal & Professional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => onUpdatePreferences({
              ...preferences,
              language: e.target.value
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.enableTranslation}
              onChange={(e) => onUpdatePreferences({
                ...preferences,
                enableTranslation: e.target.checked
              })}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-3 text-sm text-gray-700">
              Enable automatic translation suggestions
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.enableEmoji}
              onChange={(e) => onUpdatePreferences({
                ...preferences,
                enableEmoji: e.target.checked
              })}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-3 text-sm text-gray-700">
              Include emoji suggestions
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <FaRobot className="text-blue-500 mt-1 mr-2" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">How Smart Replies Work</p>
            <ul className="text-xs space-y-1">
              <li>• Analyzes conversation context and tone</li>
              <li>• Learns from your messaging patterns</li>
              <li>• Suggests replies in your preferred style</li>
              <li>• Respects privacy - all processing is secure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartReplies;
