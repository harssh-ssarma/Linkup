import axios from 'axios';
import { set } from 'mongoose';
import React, {useEffect, useState} from 'react'
import { FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import userConversation from '../Zustand/useConversation';
import { useSocketContext } from '../context/SocketContext';
import notify from '../assets/notification-sound-2-253324.mp3';





function Sidebar({onSelectUser}) {
    const navigate = useNavigate();
    const {authUser, setAuthUser} = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const {messages, selectedConversation , setMessage, setSelectedConversation} = userConversation();
    const{onlineUser,socket} = useSocketContext();


    const nowOnline = chatUser.map((user)=>(user._id));

    // chats function
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
          setNewMessageUsers(newMessage);
        })

        return ()=> socket?.off("newMessage");

    },[socket, messages]);



    //show user with u chatted
    useEffect(()=>{
        const chatUserHandler = async()=>{
            setLoading(true);
            try{
                const chatters = await axios.get(`api/user/currentchatters`);
                const data = chatters.data;
                if(data.success === false){
                    setLoading(false);
                    console.log(data.message);
                }
                setLoading(false);
                setChatUser(data);
            }
            catch(error){
                setLoading(false);
                console.log(error);
            }

        }
        chatUserHandler();
    },[])

    console.log(chatUser);


    //show user from the search result
    const handleSearchSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const search = await axios.get(`api/user/search?search=${searchInput}`);
            const data = search.data;
            if(data.success === false){
                setLoading(false);
                console.log(data.message);
            }
            setLoading(false);
            if(data.length === 0){
                toast.info("User Not Found");
            }
            else{
                setSearchUser(data);
            }

        }
        catch(error){
            setLoading(false);
            console.log(error);
        }
        
    }
    //show which user is selected
    const handleUserClick = (user)=>{
        onSelectUser(user);
        setSelectedConversation(user);
        setSelectedUserId(user?._id);
        setNewMessageUsers('');
    }
    //back from search result
    const handleSearchBack = ()=>{
        setSearchUser([]);
        setSearchInput('');
    }

    //logout
    const handleLogout = async()=>{
        const confirmlogout = window.prompt("type 'UserName' To LOGOUT");  // window.prompt is used for verification  with username after logout
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log(data?.message);
                }
                toast.info(data?.message)
                localStorage.removeItem('chatApp')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        } else {
            toast.info("LogOut Cancelled")
        }

    }
    console.log(searchUser);
  return (
    <div className='h-full w-auto px-1'>
        <div className='flex justify-between gap-2 mt-2'>
            <form onSubmit={handleSearchSubmit} className='flex items-center justify-between bg-white rounded-full w-full '>
                <input value={searchInput} 
                    onChange={(e)=>setSearchInput(e.target.value)} type='text' className='px-4 w-auto text-black bg-transparent outline-none rounded-full' placeholder='search user'/>
                <button className='btn btn-circle bg-sky-700 hover:bg-gray-800'>
                    <FaSearch/>
                </button>
                
            </form>
            <img 
                onClick={()=>navigate(`/profile/${authUser?._id}`)} 
                src={authUser?.profile_pic} 
                className='self-center h-12 w-12 hover:scale-110 cursor-pointer'
            />
        </div>
        <div className='divider px-3'></div>
        {searchUser.length > 0 ? (
            <>
                <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
                    <div className='w-auto'>
                    {searchUser.map((user, index)=>(
                                <div key={user._id}>
                                    <div 
                                        onClick={()=>handleUserClick(user)} className={`flex gap-3 items-center rounded p-2 cursor-pointer
                                            ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>

                                        {/* Socket is Online         */}
                                        <div className={`avatar ${isOnline[index] ? 'online':''}`}>
                                            <div className="w-12 rounded-full h-12">
                                                <img src={user.profile_pic} alt='user.img' />
                                            </div>
                                            </div>
                                            <div className='flex flex-col flex-1'>
                                                <p className='font-bold text-gray-950'>{user.username}</p>
                                            </div> 
                                            
                                        

                                    </div>
                                    <div className='divider px-3 divide-solid h-[1px]'></div>


                                </div>
                            )
                            )}
                    </div>
                </div>

                <div className='mt-auto px-1 py-1 flex'>
                    <button onClick={handleSearchBack} className=' rounded-full px-2 text-white py-1 self-center'>
                        <FaArrowCircleLeft size={25} />
                    </button>

                </div>    
            </>

        ):(
            <>
                <div className='min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
                    <div className='w-auto'>
                        {chatUser.length === 0 ? (
                            <>
                                <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
                                    <h1>Search username to chat</h1>
                                </div>
                            </>
                        ) : (
                            <>
                                {chatUser.map((user, index)=>(
                                    <div key={user._id}>
                                        <div 
                                            onClick={()=>handleUserClick(user)} className={`flex gap-3 items-center rounded p-2 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>

                                            {/* Socket is Online         */}
                                            <div className={`avatar ${isOnline[index] ? 'online':''} `}>
                                                <div className="w-12 rounded-full h-12">
                                                    <img src={user.profile_pic} alt='user.img' />
                                                </div>
                                                </div>
                                                <div className='flex flex-col flex-1'>
                                                    <p className='font-bold text-white'>{user.username}</p>
                                                </div> 

                                                <div>
                                                    {newMessageUsers.receiverId === authUser._id && newMessageUsers.senderId === user._id ?
                                                    <div className='rounded-full bg-green-600 text-sm text-white px-[4px]'>+1</div>:<></>
                                                    }
                                                </div>
                                            

                                        </div>
                                        <div className='divider px-3 divide-solid h-[1px]'></div>


                                    </div>
                                )
                                )}
                                
                            </>
                        )}
                    </div>
                </div>
                <div className='mt-auto px-1 py-1 flex'>
                    <button onClick={handleLogout} className='hover:bg-red-600  w-10 cursor-pointer text-white rounded-lg'>
                        <BiLogOut size={25} />
                    </button>
                    <p className='text-sm py-1 text-white'>Logout</p>
                </div>
            </>
        )}
      

    </div>
  )
}

export default Sidebar
