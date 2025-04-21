import { useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();

    const {setAuthUser} = useAuth();
    const [userInput, setUserInput] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInput = (e) => {
        setUserInput({...userInput, [e.target.id]: e.target.value});

    }
    console.log(userInput);


    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const login = await axios.post('api/auth/login', userInput);
            const data = login.data;
            if(data.success === false){
                setLoading(false);
                console.log(data.message);
            }

            toast.success(data.message);
            localStorage.setItem('chatApp', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false); 
            navigate('/');   
        }
        catch(err){
            setLoading(false);
            console.log(err);
            toast.error(err?.response?.data?.message);
        }
    }
  return (
    <div className='flex flex-col items-center justify-center mx-auto  '>
        <div className=" p-10 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg">
            <h1 className="text-3xl font-bold text-center text-gray-600">Login<span className='text-gray-500'> Chatters</span></h1>
            <form className="mt-6 flex flex-col" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className=" mb-2 text-lg font-bold text-gray-600 ">Email</label>
                    <input type="email" name="email" id="email" placeholder=" Enter Your Email" className="w-full p-3 rounded-lg focus:outline-none text-black bg-gray-100" onChange={handleInput} required />
                </div>
                <div className="mb-5">
                    <label className=" mb-2 text-lg font-bold text-gray-600">Password</label>
                    <input type="password" name="password" id="password" placeholder="Enter Your Password" className="w-full p-3 text-black rounded-lg focus:outline-none bg-gray-100" required onChange={handleInput} />
                </div>
                <button type="submit" className="w-auto self-center px-10 py-3 mt-4 bg-gray-800 rounded-md text-white text-sm hover:bg-gray-700 hover: scale-105">
                    {loading ? "Loading.. ": "Login"}
                </button>
            </form> 
            <div className='pt-2 '>
                <p className='text-sm font-semibold text-gray-800  '>Don't have an account ? <Link to={'/register'}>
                    <span className='text-green-950 font-bold underline cursor-pointer hover:text-gray-950'>
                        Register Now!!
                        </span></Link>
                </p>

            </div>   

        </div>
      
    </div>
  )
}

export default Login
