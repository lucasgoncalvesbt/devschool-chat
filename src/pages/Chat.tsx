import './../styles/chat.scss';

import { AxiosResponse } from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ChatGroup } from './ChatGroup';
import { io } from 'socket.io-client';

type RoomType = {
  _id: string;
  nome: string;
}

const socket = io("localhost:3333");

const Chat = () => {
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<RoomType[]>([]);

  

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectou no socket!")
    })
  }, [socket]);

  useEffect(() => {
    const onLoad = async () => {
      
      const response: AxiosResponse<RoomType[]> = await api.get('/room');
      const roomsResponse: RoomType[] = response.data; 
      setRooms(roomsResponse);
    }

    onLoad();
  }, [isAuthenticated])

  const getRoomName = () => {
    return pathname.split("/")[2];
  }
  
  return (
    <div className="tudo">
      <div className="grupos">
        <h2>Mural do Carlos</h2>
        <div className="lista-chat">
          {rooms.map((room) => {
            return (
              <Link to={`${url}/${room._id}`} key={room._id}>
                <div className={"lista-chat-item " + (room._id === getRoomName() ? 'chat-ativo' : '')} >
                  <h4>{room.nome}</h4>
                  <span>Fulano: blablablabla</span>
                </div>  
              </Link>
            )
          })}
        </div>
        
      </div>    
        <Switch>
          <Route exact path={path}>
            <h3>Please select a Room.</h3>
          </Route>
          <Route path={`${path}/:roomName`}>
            <ChatGroup socket={socket}/>
          </Route>
          <Route path={`${path}/*`}>
            <Redirect to={`${path}`} />
          </Route>
        </Switch>
    </div>
  )
}

export default Chat;