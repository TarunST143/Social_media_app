import React, { useContext, useEffect, useState } from 'react'
import '../styles/Stories.css'
import { BiPlusCircle } from 'react-icons/bi'
import { GeneralContext } from '../context/GeneralContextProvider';
import axios from 'axios';
import {RxCross2} from 'react-icons/rx'

const Stories = () => {

    const {socket, setIsCreateStoryOpen} = useContext(GeneralContext);

    const [stories, setStories] = useState([])
    const [isStoryPlaying, setIsStoryPlaying] = useState(false);

    const [story, setStory] = useState();

    const addStory = async () =>{
        setIsCreateStoryOpen(true)
    }

    useEffect(() => {
        fetchStories();
      }, []);
    
      const fetchStories = async () => { 
        try {
          
            const response = await axios.get('http://localhost:6001/fetchAllStories');
            setStories(response.data)
            console.log(response.data[0])
        } catch (error) {
          console.error(error);
        }
      };

      const handleOpenStory = async (story) =>{
       
        setStory(story);
        await socket.emit('story-played', {storyId: story._id, userId: localStorage.getItem('userId')});
        setIsStoryPlaying(true);
        
      }

  return (
    <div className='storiesContainer'> 
    
        <div className="storiesTitle">
            <h3>Stories</h3>
        </div> 

        <div className="storiesBody" style={isStoryPlaying ? {display: 'none'} : {}}>

            <div className="stories">

                <div className="story self-story" onClick={addStory}>
                    <img src={localStorage.getItem('profilePic')} alt="" />
                    <p>Add story</p>
                    <span><BiPlusCircle /></span>
                </div>

                {
                   stories && stories.filter(story => ((localStorage.getItem('following').includes(story.userId) 
                                                                || story.userId === localStorage.getItem('userId'))
                                                                         && (Math.abs(Math.round((new Date().getTime() - new Date(story.createdAt).getTime()) / (1000 * 60 * 60)))) < 24 ))
                        .map((story)=>(

                        <div className="story user-story" key={story._id} 
                                    onClick={()=> handleOpenStory(story)} 
                                    style={story.viewers.includes(localStorage.getItem('userId'))
                                                     ? {border: '3px solid #a5a7a995'}
                                                     : {border: '3px solid #569bdfc9'} 
                                                     } >
                            <img src={story.userPic} alt="" />
                            <p>{story.username}</p>
                        </div>
                    ))
                }

            </div>
            
        </div>

        {story && 
        
            <div className="storyPlayContainer" style={isStoryPlaying ? {} : {display: 'none'}}>
                    <div className="storyPlayBodyTop">
                        <p>{story.username}</p>
                        <span onClick={()=>setIsStoryPlaying(false)}><RxCross2 /></span>
                    </div>
                    <div className="storyPlayBodyContent">
                        {story.fileType === 'photo' ?
                             <img src={story.file} alt="" />
                        : 
                            <video id="videoPlayer" className='postimg' controls autoPlay muted>
                                <source src={story.file} />
                            </video>
                        }
                       
                        <p>{story.text}</p>
                    </div>
            </div>
        }

    
    
    </div>
  )
}

export default Stories