
import Chats from './models/Chats.js';
import Post from './models/Post.js'
import Stories from './models/Stories.js';
import User from './models/Users.js'

const SocketHandler = (socket) => {
  
    socket.on('postLiked', async ({userId, postId}) =>{
        await Post.updateOne({_id: postId}, {$addToSet: {likes: userId}});

        socket.emit("likeUpdated");
    })

    socket.on('postUnLiked', async ({userId, postId}) =>{
        await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
        socket.emit("likeUpdated");
    })

    socket.on("fetch-profile", async({_id})=>{
        const user = await User.findOne({_id})
        console.log(user);
        socket.emit("profile-fetched", {profile: user})
    })

    
    socket.on('updateProfile', async ({userId, profilePic, username, about})=>{
        const user = await User.updateOne({_id: userId}, {profilePic: profilePic, username: username, about:about})
        socket.emit("profile-fetched", {profile: user})
    })

    socket.on('user-search', async({username})=>{
        const user = await User.findOne({username:username});
        socket.emit('searched-user', {user});
    })

    socket.on('followUser', async({ownId, followingUserId})=>{
        await User.updateOne({_id: ownId}, {$addToSet: {following: followingUserId}});
        await User.updateOne({_id: followingUserId}, {$addToSet: {followers: ownId}});

        const user1 = await User.findOne({_id: ownId});
        const user2 = await User.findOne({_id: followingUserId});
        socket.emit('userFollowed', {following: user1.following});

        if ( user2.following.includes(user1._id)   && user1.following.includes(user2._id) ){
            const newChat = new Chats({
                _id: user1._id > user2._id ? user1._id + user2._id : user2._id + user1._id
            })

            const chat = await newChat.save();
        }

    });

    socket.on('unFollowUser', async({ownId, followingUserId})=>{
        await User.updateOne({_id: ownId}, {$pull: {following: followingUserId}});
        await User.updateOne({_id: followingUserId}, {$pull: {followers: ownId}});

        const user = await User.findOne({_id: ownId});
        socket.emit('userUnFollowed', {following: user.following});
    });


    socket.on('makeComment', async({postId, username, comment})=>{
        await Post.updateOne({_id: postId}, { $push: { comments: [ username, comment]  } });
    });

    socket.on('fetch-friends', async ({userId}) =>{

        const userData = await User.findOne({_id: userId})

        function findCommonElements(array1, array2) {
            return array1.filter(element => array2.includes(element));
        }

        const friendsList = findCommonElements(userData.following, userData.followers);

        const friendsData = await User.find(
            { _id: { $in: friendsList } },
            { _id: 1, username: 1, profilePic: 1 }
          ).exec();

        socket.emit("friends-data-fetched", {friendsData});
    })


    socket.on('fetch-messages', async ({chatId}) =>{
        const chat = await Chats.findOne({_id: chatId});
       
        await socket.join(chatId);

        await socket.emit('messages-updated', {chat: chat});

    }) 

    socket.on('update-messages', async ({ chatId }) => {
        try {
          const chat = await Chats.findOne({ _id: chatId });
          console.log('updating messages');
          socket.emit('messages-updated', { chat });
        } catch (error) {
          console.error('Error updating messages:', error);
        }
      });
      
      socket.on('new-message', async ({ chatId, id, text, file, senderId, date }) => {
        try {
          await Chats.findOneAndUpdate(
            { _id: chatId },
            { $addToSet: { messages: { id, text, file, senderId, date } } },
            { new: true }
          );
      
          const chat = await Chats.findOne({ _id: chatId });
          console.log(chat);
          socket.emit('messages-updated', { chat });
          socket.broadcast.to(chatId).emit('message-from-user');
        } catch (error) {
          console.error('Error adding new message:', error);
        }
      });


      socket.on('chat-user-searched', async ({ownId, username})=>{
        const user = await User.findOne({username:username});
        if(user){
          if (user.followers.includes(ownId) && user.following.includes(ownId)){

            socket.emit('searched-chat-user', {user});
  
          }else{
            socket.emit('no-searched-chat-user');
          }
        }else{
          socket.emit('no-searched-chat-user');
        }
      });


      socket.on('fetch-all-posts', async()=>{
        const posts = await Post.find();
        socket.emit('all-posts-fetched', {posts});
      })


      socket.on('delete-post', async ({postId}) =>{
        await Post.deleteOne({_id: postId});
        const posts = await Post.find();
        socket.emit('post-deleted', {posts});
      });


      socket.on('create-new-story', async({userId, username, userPic, fileType, file, text})=>{
        const newStory = new Stories({userId, username, userPic, fileType, file, text});
        await newStory.save();
      })

      socket.on('fetch-stories', async()=>{
        const stories = await Stories.find();
        socket.emit('stories-fetched', {stories});
      });

      socket.on('story-played', async ({storyId, userId})=>{
        await Stories.updateOne({_id: storyId}, {$addToSet: {viewers: userId}});
        
      })
}

export default SocketHandler;