import React, { useContext, useEffect, useState } from 'react'
import '../styles/ProfilePage.css'
import '../styles/Posts.css';
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FaGlobeAmericas } from "react-icons/fa";
import {IoIosPersonAdd} from 'react-icons/io'
import HomeLogo from '../components/HomeLogo'
import Navbar from '../components/Navbar'
import { AuthenticationContext } from '../context/AuthenticationContextProvider'
import { GeneralContext } from '../context/GeneralContextProvider'
import {useParams} from 'react-router-dom';
import axios from 'axios';

const Profile = () => {

  const {logout} = useContext(AuthenticationContext);

  const {socket} = useContext(GeneralContext);

  const {id} = useParams();
  const userId = localStorage.getItem("userId");

  const [userProfile, setUserProfile] = useState([]);

const [updateProfilePic, setUpdateProfilePic] = useState('');
const [updateProfileUsername, setUpdateProfileUsername] = useState('');
const [updateProfileAbout, setUpdateProfileAbout] = useState('');

const [isUpdating, setIsUpdating] = useState(false);


  useEffect(()=>{

    socket.emit("fetch-profile", {_id: id});

    socket.on("profile-fetched", async({profile})=>{
      setUserProfile(profile);
      setUpdateProfilePic(profile.profilePic);
      setUpdateProfileUsername(profile.username);
      setUpdateProfileAbout(profile.about);
    })


  },[socket])


  const handleUpdate = async () =>{
    socket.emit('updateProfile', {userId: userProfile._id, profilePic: updateProfilePic, username: updateProfileUsername, about: updateProfileAbout});
    setIsUpdating(false);
  }


  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetchAllPosts');
      const fetchedPosts = response.data;
      setPosts(fetchedPosts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = (userId, postId) =>{
    socket.emit('postLiked', {userId, postId});

}

const handleUnLike = (userId, postId) =>{
    socket.emit('postUnLiked', {userId, postId});

}

const handleFollow = async (userId) =>{
  socket.emit('followUser', {ownId: localStorage.getItem('userId'), followingUserId: userId});
}
const handleUnFollow = async (userId) =>{
  socket.emit('unFollowUser', {ownId: localStorage.getItem('userId'), followingUserId: userId});
}

useEffect(()=>{
  socket.on('userFollowed', ({following})=>{
    localStorage.setItem('following', following);
})

socket.on('userUnFollowed', ({following})=>{
  localStorage.setItem('following', following);
})
})



const [followDisplayType, setFollowDisplayType] = useState('followers');

const [comment, setComment] = useState('');

    const handleComment = (postId, username)=>{
        socket.emit('makeComment', {postId, username, comment});
        setComment('');
    }

const handleDeletePost = async (postId) =>{
    await socket.emit('delete-post', {postId});
}

useEffect(()=>{

  socket.on('post-deleted', async ({posts})=>{
    
    setPosts(posts)
  })

},[socket])


  return (
    <div className='profilePage'>
      <HomeLogo />
      <Navbar />

        <div className="profileCard" style={isUpdating ? {display:'none'}: {display:"flex"}}>

            <img src={userProfile.profilePic} alt="" />

            <h4>{userProfile.username}</h4>
            <p>{userProfile.about} </p>


            <div className="profileDetailCounts">
              
              <div className="followersCount">
                <p>Followers</p>
                <p>{userProfile.followers ? userProfile.followers.length : 0}</p>
              </div>
              <div className="followingCounts">
                <p>Following</p>
                <p>{userProfile.following ? userProfile.following.length : 0}</p>
              </div>
            </div>

            <div className="profileControls">
            {
              userProfile._id === userId ? 

              <div className="profileControlBtns">

                <button onClick={async () => {await logout()}}>Logout</button>

                <button type="button" className="btn btn-primary" onClick={()=>setIsUpdating(true)}>Edit</button>
                

              </div>

              :
              <div className="profileControlBtns">

              {
                localStorage.getItem('following').includes(userProfile._id) ?
                <>
                <button onClick={()=>handleUnFollow(userProfile._id)} style={{backgroundColor: 'rgb(224, 42, 42)'}}>Unfollow</button>
                <button >Message</button>
                </>
                :

                <button onClick={()=>handleFollow(userProfile._id)}>Follow</button>

              }

              </div>
            }
            </div>

        </div>
        

        <div className='profileEditCard'style={!isUpdating ? {display:'none'}: {display:"flex"}}>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Profile Image</label>
            <input type="text" class="form-control" id="exampleInputEmail1" onChange={(e)=> setUpdateProfilePic(e.target.value)} value={updateProfilePic} />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Username</label>
            <input type="text" class="form-control" id="exampleInputPassword1" onChange={(e)=> setUpdateProfileUsername(e.target.value)} value={updateProfileUsername}/>
          </div>
          <div class="mb-3">
            <label for="editAbout" class="form-label">About</label>
            <input type="text" class="form-control" id="editAbout" onChange={(e)=> setUpdateProfileAbout(e.target.value)} value={updateProfileAbout}/>
          </div>
          <button className='btn btn-primary' onClick={handleUpdate}>Update</button>
        </div>








          <div className="profilePostsContainer">
          
          {posts.filter(post => post.userId === userProfile._id).map((post) => {
            


            return(

            <div className="Post" key={post._id}>

            <div className="postTop">
                <div className="postTopDetails">
                    <img src={post.userPic} alt="" className="userpic" />
                    <h3 className="usernameTop">{post.userName}</h3>
                </div>
                <button className='btn btn-danger deletePost' onClick={()=> handleDeletePost(post._id)}>Delete</button>
            </div>

            { post.fileType === 'photo'?
                    
                    <img src={post.file} className='postimg' alt="" />
                
                    :
                    
                    <video id="videoPlayer" className='postimg' controls autoPlay muted>
                        <source src={post.file} />
                    </video>
                    
                    }

            <div className="postReact">
                <div className="supliconcol">

                    {
                        post.likes.includes(localStorage.getItem('userId')) ?

                        <AiTwotoneHeart className='support reactbtn'  onClick={() => handleUnLike(localStorage.getItem('userId'), post._id)}/>

                        :

                        <AiOutlineHeart className='support reactbtn'  onClick={() => handleLike(localStorage.getItem('userId'), post._id)}/>
                    }


                    
                    <label htmlFor="support" className='supportCount'>{post.likes.length}</label>
                </div>
                <BiCommentDetail className='comment reactbtn' />
                {/* <FiSend className='share reactbtn' onClick={()=> {handleShare(post)}} /> */}
                <div className="placeiconcol">
                    <FaGlobeAmericas className='placeicon reactbtn' name='place' />
                    <label htmlFor="place" className='place'>{post.location}</label>
                </div>
            </div>

            

            <div className="detail">
                <div className='descdataWithBtn'>
                    <label htmlFor='username' className="desc labeldata" id='desc'> 
                        <span style={{fontWeight: 'bold'}}>
                            {post.userName}
                        </span> 
                            &nbsp;   {post.description}
                    </label>
                </div>
            </div>

            <div className="commentsContainer">
                <div className="makeComment">
                    <input type="text" placeholder='type something...' onChange={(e)=>setComment(e.target.value)}/>
                    {comment.length === 0 ?
                        <button className='btn btn-primary' disabled>comment</button>
                    :
                        <button className='btn btn-primary' onClick={()=>handleComment(post._id, localStorage.getItem('username'))} >comment</button>
                    }
                </div>
                <div className="commentsBody">
                    <div className="comments">
                        {post.comments.map((comment)=>{
                            return(

                                <p><b>{comment[0]}</b> {comment[1]}</p>
                            )
                        })}
                    </div>
                </div>
            </div>

            </div>
            )

            })}



          </div>


        </div>
  )
}

export default Profile