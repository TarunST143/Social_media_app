import React, { useContext, useState } from 'react';
import '../styles/CreatePosts.css'
import { GeneralContext } from '../context/GeneralContextProvider';
import { RxCross2 } from 'react-icons/rx';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const CreateStory = () => {

    const {socket, isCreateStoryOpen, setIsCreateStoryOpen} = useContext(GeneralContext);

    const [storyType, setStoryType] = useState('photo');
    const [storyDescription, setStoryDescription] = useState('');
    const [storyFile, setStoryFile] = useState(null);
 
    const [uploadProgress, setUploadProgress] = useState();

    if (uploadProgress === 100){
        setStoryDescription('');
        setStoryFile(null);
        setIsCreateStoryOpen(false);
        setUploadProgress();
    }


    const handleStoryUpload = async (e) =>{
        e.preventDefault();
        const storageRef = ref(storage, uuidv4());
        const uploadTask = uploadBytesResumable(storageRef, storyFile);

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
                await socket.emit('create-new-story', {userId: localStorage.getItem('userId'), username: localStorage.getItem('username'), 
                                                        userPic: localStorage.getItem('profilePic'), fileType: storyType, file: downloadURL, 
                                                        text: storyDescription});
                setIsCreateStoryOpen(false);
                setStoryDescription('');
                setStoryFile(null);
                setIsCreateStoryOpen(false);
                setUploadProgress();

            }catch(err){
                console.log(err);
            }  });
        } );
    }

  return (
    <div className="createPostModalBg" style={isCreateStoryOpen? {display: 'contents'} : {display: 'none'}} >
            <div className="createPostContainer">
               
                <RxCross2 className='closeCreatePost' onClick={()=> setIsCreateStoryOpen(false)} />
                <h2 className="createPostTitle">Add new story</h2>
                <hr className="createPostHr" />
                
                <div className="createPostBody">
                    <form>

                    <select className="form-select" aria-label="Select Post Type" onChange={(e)=> setStoryType(e.target.value)}  >
                        <option defaultValue='photo'>Choose post type</option>
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                    </select>

                        <div className="uploadBox">
                            <input type="file" name="PostFile" id="uploadPostFile" onChange={(e)=> setStoryFile(e.target.files[0])} />
                        </div>
                        <div className="form-floating mb-3 authFormInputs descriptionInput">
                            <input type="text" className="form-control descriptionInput" id="floatingDescription" placeholder="Description" 
                                                                onChange={(e)=> setStoryDescription(e.target.value)} value={storyDescription}  /> 
                            <label htmlFor="floatingDescription">Text</label>
                        </div>
                        {uploadProgress ?
                            <button disabled>Uploading... {Math.round(uploadProgress)}%</button>
                        :
                        <button onClick={handleStoryUpload}>Upload</button>
                        }
                    </form>
                </div>
            </div>
        </div>
  )
}

export default CreateStory