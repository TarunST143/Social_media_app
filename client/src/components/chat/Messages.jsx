import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Messages = () => {

  const {socket} = useContext(GeneralContext)
  const [messages, setMessages] = useState([]);
  const {chatData} = useContext(GeneralContext);

  useEffect(()=>{
    const handleMessagesUpdated = ({ chat }) => {
      console.log('chatuu', chat);
      if (chat) {
        setMessages(chat.messages);
      }
    };
  
    const handleNewMessage = async () => {
      console.log('new message', chatData.chatId);
      socket.emit('update-messages', { chatId: chatData.chatId });
    };
  
    socket.on('messages-updated', handleMessagesUpdated);
    socket.on('message-from-user', handleNewMessage);
  
    return () => {
      // Clean up event listeners when the component unmounts
      socket.off('messages-updated', handleMessagesUpdated);
      socket.off('message-from-user', handleNewMessage);
    };
  },[socket, chatData])

  return (
    <div className='messages' >
      
      {messages.length > 0 &&  messages.map((message)=>(
        <Message message={message} key={message.id} />
      ))
      }
</div>
  )
}
export default Messages