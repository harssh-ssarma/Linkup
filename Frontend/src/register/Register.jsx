import React , {useState}from 'react'
import { Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



function Register() {

    const navigate = useNavigate();
    const {setAuthUser} = useAuth();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({});



    const handleInput = (e)=>{
        setInputData({...inputData, [e.target.id]: e.target.value});

    }

    const selectGender = (selectGender)=>{
        setInputData((prev)=>({
            ...prev, gender:selectGender === inputData ? '' : selectGender
        }))
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        if(inputData.password !== inputData.confpassword.toLowerCase()){
            setLoading(false);
            return toast.error('Password do not match');
        }
        try{
            const register = await axios.post('api/auth/register', inputData);
            const data = register.data;
            if(data.success === false){
                setLoading(false);
                console.log(data.message);
            }

            toast.success(data?.message);
            localStorage.setItem('chatApp', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false); 
            navigate('/login');   
   
        }
        catch(err){
            setLoading(false);
            console.log(err);
            toast.error(err?.response?.data?.message);
        }

    }
  return (
    <div className='flex flex-col items-center justify-center mx-auto  '>
        <div className=" p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg">
            <h1 className="text-3xl font-bold text-center text-gray-600">Register<span className='text-gray-500'> Chatters</span></h1>

            <form className="flex flex-col " onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label className=" mb-2 text-md font-bold text-gray-600 ">FullName</label>
                    <input type="fullname" name="fullname" id="fullname" placeholder=" Enter Fullname" className="w-full p-2 text-black rounded-lg focus:outline-none bg-gray-100" onChange={handleInput} required />
                </div>
                <div className="mb-3">
                    <label className=" mb-2 text-md font-bold text-gray-600">UserName</label>
                    <input type="username" name="username" id="username" placeholder=" Enter Username" className="w-full p-2 text-black rounded-lg focus:outline-none bg-gray-100" onChange={handleInput} required />
                </div>
                <div className="mb-3">
                    <label className=" mb-2 text-md font-bold text-gray-600 ">Email</label>
                    <input type="email" name="email" id="email" placeholder=" Enter Email" className="w-full p-2 rounded-lg text-black focus:outline-none bg-gray-100" onChange={handleInput} required />
                </div>
                <div className="mb-3">
                    <label className=" mb-2 text-md font-bold text-gray-600">Password</label>
                    <input type="password" name="password" id="password" placeholder="Enter Password" className="w-full p-2 text-black rounded-lg focus:outline-none bg-gray-100" required onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label className=" mb-2 text-md font-bold text-gray-600"> Confirm Password</label>
                    <input type="password" name="confpassword" id="confpassword" placeholder="Enter confirm password" className="w-full p-3  text-black rounded-lg focus:outline-none bg-gray-100" required onChange={handleInput} />
                </div>
                <div id='gender' className='flex gap-4'>
                    <label className='cursor-pointer label flex gap-4'>
                        <span className='label-text font-bold text-gray-600 text-md '>Male</span>
                        <input  onChange={()=>selectGender('male')} checked={inputData.gender === 'male'} type='checkbox'  className='checkbox checkbox-info' />
                    </label>
                    <label className='cursor-pointer label flex gap-4'>
                        <span className='label-text font-bold text-gray-600 text-md '>Female</span>
                        <input onChange={()=>selectGender('female')} checked={inputData.gender === 'female'} type='checkbox' className='checkbox checkbox-info' />
                    </label>    
                </div>
                <button type="submit" className="w-auto self-center px-10 py-3 mt-2 bg-gray-800 rounded-md text-white text-sm hover:bg-gray-700 hover: scale-105">
                    {loading ? "Loading.. ": "Register"}
                </button>
            </form> 
            <div className='pt-2 '>
                <p className='text-sm font-semibold text-gray-800  '>Do You have an account ? <Link to={'/login'}>
                    <span className='text-green-950 font-bold underline cursor-pointer hover:text-gray-950'>
                        Login Now!!
                        </span></Link>
                </p>

            </div>   

        </div>
    </div>    

  )
}

export default Register
