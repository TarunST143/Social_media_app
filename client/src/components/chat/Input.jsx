import React, { useContext, useState } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { GeneralContext } from '../../context/GeneralContextProvider'
import {v4 as uuid} from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';

const Input = () => {

    const {socket, chatData} = useContext(GeneralContext);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState();
    const userId = localStorage.getItem('userId');

    const handleSend = async () =>{

      if (file){
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
        (snapshot) => {
            setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100); 
        }, 
        (error) => {
            console.log(error);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            console.log('File available at', downloadURL);

            try{
              let date = new Date() 
              await socket.emit('new-message', {chatId: chatData.chatId ,id: uuid(), 
                                                  text: text, file: downloadURL, 
                                                  senderId: userId, date: date});
              setUploadProgress();
              setText('');
              setFile(null);
            }catch(err){
                console.log(err);
            }
            });
        });
      }else{
        let date = new Date() 
        await socket.emit('new-message', {chatId: chatData.chatId ,id: uuid(), 
                                            text: text,file: '', senderId: userId, date: date});
        setText('');
      }
    }

  return (
    <div className='input' >
      <input type="text" placeholder='type something...' onChange={e => setText(e.target.value)} value={text} />
      <div className="send">
        <input type="file" style={{display : 'none'}} id='file' onChange={e=> setFile(e.target.files[0])} />
        <label htmlFor="file" style={{display:'flex'}}>
          <BiImageAdd />
          <p style={{fontSize: '12px'}}>{uploadProgress ? Math.floor(uploadProgress) + '%' : ''}</p>
        </label>
        <button onClick={handleSend} >Send</button>
      </div>
    </div>
  )
}

export default Input