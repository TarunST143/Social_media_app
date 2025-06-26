import React, { useContext } from 'react'
import '../styles/Notifications.css'
import {RxCross2} from 'react-icons/rx' 
import { GeneralContext } from '../context/GeneralContextProvider'

const Notifications = () => {

    const {isNotificationsOpen, setNotificationsOpen} = useContext(GeneralContext);

  return (
    <>
        <div className="notificationsModalBg" style={isNotificationsOpen? {display: 'contents'} : {display: 'none'}} >
            <div className="notificationsContainer">
               
                <RxCross2 className='closenotifications' onClick={()=> setNotificationsOpen(false)} />
                <h2 className="notificationsTitle">Notifications</h2>
                <hr className="notificationsHr" />
                
                <div className="notificationsBody">
                    <p>No new notifications</p>
                </div>
            </div>
        </div>
    </>
  )
}

export default Notifications;