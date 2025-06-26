import React, { useContext, useEffect, useRef } from 'react'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Message = ({message}) => {

  const {chatData} = useContext(GeneralContext);
  const ref = useRef();
  let date = new Date(message.date);

  useEffect(() => {
    ref.current?.scrollIntoView({behavior:'smooth'})
  }, [message]);

  const userId = localStorage.getItem('userId');
  return (
    <div>
        <div ref={ref} className={`message ${message.senderId === userId ? "owner" : ""}`}>
      <div className="messageInfo">
        <img src={message.senderId === userId ? localStorage.getItem('profilePic') : chatData.user.profilePic} alt="" />
        <span>{ date.getHours() < 12 ?  date.getHours() + ':' + date.getMinutes() + ' AM' : date.getHours()-12 + ':' + date.getMinutes() + ' PM' }</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.file && <img src={message.file} alt="" />}
      </div>
    </div>
    </div>
  )
}

export default Message