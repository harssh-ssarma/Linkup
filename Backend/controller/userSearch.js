import User from '../Models/userModels.js';
import Conversation from '../Models/conversationModels.js';

export const getUserBySearch = async (req, res) => {
    try{
        const search = req.query.search || '';
        const currentUserId = req.user._id;
        const user = await User.find({
            $and: [
                {
                    $or: [
                        {username:{ $regex:'.*'+search+'.*', $options: 'i'}},  // In postman we search like that http://localhost:3000/api/user/search?search=username or fullname
                        {fullname:{ $regex:'.*'+search+'.*', $options: 'i'}},

                    ]
                },{
                    _id: {$ne: currentUserId}
                }
            ]
        }).select("-password").select("-email");

        res.status(200).send(user)

    }
    catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }

}


export const getCurrentChatters = async (req, res) => {
    try{

        // sort all the user with their last message
        const currentUserId = req.user._id;
        const currentChatters = await Conversation.find({
            participants: currentUserId
        }).sort({
            updatedAt:-1
        });

        // if there is no conversation then return empty array
        if(!currentChatters || currentChatters.length === 0){
            return res.status(200).send([])
        }

        // get all the participants id from the conversation
        const participantsIds = currentChatters.reduce((ids, conversation)=>{
            const otherParticipants = conversation.participants.filter(id => id !== currentUserId);
            return [...ids, ...otherParticipants];
        },[]);

        // remove duplicate participants id
        const otherParticipantsIds = participantsIds.filter(id => id.toString() !== currentUserId.toString());

        // get the user details of the participants

        const user = await User.find({
            _id: {$in: otherParticipantsIds}
        }).select("-password").select("-email");

        // sort the user array according to the last message

        const users = otherParticipantsIds.map(id => user.find(user => user._id.toString() === id.toString()));

        res.status(200).send(users);
    }
    catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}