import express from 'express';
import { userRegister } from '../controller/userRegister.js';
import { userLogin } from '../controller/userLogin.js';
import { userLogout } from '../controller/userLogout.js';

const router = express.Router();

router.post('/register', userRegister);

router.post('/login', userLogin);

router.post('/logout', userLogout);



export default router;