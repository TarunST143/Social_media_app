import React, { createContext, useEffect, useState} from 'react';
import socketIoClient from 'socket.io-client';


export const SocketContext = createContext();

const WS = 'http://localhost:6001';

const socket = socketIoClient(WS);

export const SocketContextProvider =  ({children}) => {

    <SocketContext.Provider  value={{socket}} >{children}</SocketContext.Provider>
}

