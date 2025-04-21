import express from 'express';
import { sendMessage , getMessage} from '../controller/userMessage.js';
import isLogin from '../middleware/isLogin.js';

const router = express.Router();

// for send the message

router.post('/send/:id',isLogin, sendMessage);  // send the message

router.get('/:id', isLogin, getMessage);

export default router;
