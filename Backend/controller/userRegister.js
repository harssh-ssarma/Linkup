import User from '../Models/userModels.js';
import bcryptjs from 'bcryptjs';
import jwtToken from '../utils/jsonwebtoken.js';

export const userRegister = async(req,res)=>{
    try {
        const { fullname, username, email, gender, password, profile_pic } = req.body;

        const user = await User.findOne({username, email});
        if(user){
            return res.status(400).json({ 
                success: "false" , 
                message: "Username or Email Already Exist"
            });
        }

        const hashPassword =await bcryptjs.hash(password, 10);

        //  there is a link which gives an avatar after every refresh of the page "https://avatar.iran.liara.run/public/boy"

        const profile_boy = profile_pic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profile_girl = profile_pic || `https://avatar.iran.liara.run/public/girl?username=${username}`;
         
        const newUser = new User({
            fullname,
            username,
            email,
            password : hashPassword,
            gender,
            profile_pic : gender === "male" ? profile_boy  : profile_girl
        })

        if(newUser){
            await newUser.save();
            jwtToken(newUser._id, res);

        }
        else{
            res.status(500).send({
                success : false,
                message :  "Invalid User Data"
            })
        }

        // if it successful then send  to frontend
        res.status(201).send({
            _id : newUser._id,
            fullname : newUser.fullname,
            username : newUser.username,
            email : newUser.email,
            profile_pic : newUser.profile_pic,
        })


        
        
    } catch (error) {

        res.status(500).send({
            success : false,
            message : error.message
        })
        console.log(error.message);
        
    }
}