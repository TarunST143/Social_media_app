import React, { useContext, useState } from 'react'
import '../styles/CreatePosts.css'
import {RxCross2} from 'react-icons/rx' 
import { GeneralContext } from '../context/GeneralContextProvider'
import axios from "axios";
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const CreatePost = () => {

    const {isCreatPostOpen, setIsCreatePostOpen} = useContext(GeneralContext);
    const [postType, setPostType] = useState('photo');
    const [postDescription, setPostDescription] = useState('');
    const [postLocation, setPostLocation] = useState('');
    const [postFile, setPostFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState();

    if (uploadProgress === 100){
        setPostDescription('');
        setPostLocation('');
        setPostFile(null);
        setIsCreatePostOpen(false);
        setUploadProgress();
    }
    const handlePostUplload = async (e) =>{
        e.preventDefault();
        const storageRef = ref(storage, uuidv4());
        const uploadTask = uploadBytesResumable(storageRef, postFile);
        uploadTask.on('state_changed', 
        (snapshot) => {
            setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100); 
        }, 
        (error) => {
            console.log(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            console.log('File available at', downloadURL);
            try{
                const inputs = {userId: localStorage.getItem('userId'), userName: localStorage.getItem('username'), 
                                    userPic: localStorage.getItem('profilePic'), fileType: postType, file: downloadURL, 
                                    description: postDescription, location: postLocation, comments:{"New user": "This is my forst comment"}}
                
                await axios.post('http://localhost:6001/createPost', inputs)
                .then( async (res)=>{
                }).catch((err) =>{
                    console.log(err);
                });
        
            }catch(err){
                console.log(err);
            }});
        });
    }



  return (
    <>
        <div className="createPostModalBg" style={isCreatPostOpen? {display: 'contents'} : {display: 'none'}} >
            <div className="createPostContainer">
               
                <RxCross2 className='closeCreatePost' onClick={()=> setIsCreatePostOpen(false)} />
                <h2 className="createPostTitle">Create post</h2>
                <hr className="createPostHr" />
                
                <div className="createPostBody">
                    <form>

                    <select className="form-select" aria-label="Select Post Type" onChange={(e)=> setPostType(e.target.value)}  >
                        <option defaultValue='photo'>Choose post type</option>
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                    </select>

                        <div className="uploadBox">
                            <input type="file" name="PostFile" id="uploadPostFile" onChange={(e)=> setPostFile(e.target.files[0])} />
                        </div>
                        <div className="form-floating mb-3 authFormInputs descriptionInput">
                            <input type="text" className="form-control descriptionInput" id="floatingDescription" placeholder="Description" 
                                                                    onChange={(e)=> setPostDescription(e.target.value)} value={postDescription}  /> 

                            <label htmlFor="floatingDescription">Description</label>
                        </div>
                        <div className="form-floating mb-3 authFormInputs postLocation">
                            <input type="text" className="form-control  postLocation" id="floatingLocation" placeholder="Location" 
                                                                    onChange={(e)=> setPostLocation(e.target.value)}  value={postLocation}  /> 
                                                                    
                            <label htmlFor="floatingLocation">Location</label>
                        </div>
                        {uploadProgress ?
                            <button disabled>Uploading... {Math.round(uploadProgress)}%</button>
                        :
                        <button onClick={handlePostUplload}>Upload</button>
                        }
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default CreatePost