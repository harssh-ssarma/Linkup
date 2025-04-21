import User from '../Models/userModels.js';
import bcryptjs from 'bcryptjs';
import jwtToken from '../utils/jsonwebtoken.js';

export const userLogin = async(req,res)=>{
    try {
        const {email,password } = req.body;

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ 
                success: "false" , 
                message: "Invalid Email"
            });
        }

        const comparePassword = await bcryptjs.compare(password, user.password || "");
        if(!comparePassword){
            return res.status(400).json({ 
                success: "false" , 
                message: "Invalid Password"
            });
        }

        jwtToken(user._id, res);

        res.status(200).send({
            _id : user._id,
            fullname : user.fullname,
            username : user.username,
            email : user.email,
            profile_pic : user.profile_pic,
            message : "Login Success"
        })
    }
    catch (error) {
        res.status(500).send({
            success : false,
            message : error
        })
        console.log(error);
    }    

}