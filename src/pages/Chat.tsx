import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { Link, Redirect, Route, Switch, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

import "./../styles/chat.scss"
import { ChatGroup } from './ChatGroup';

type RoomType = {
  _id: string;
  nome: string;
}

const Chat = () => {
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<RoomType[]>([]);

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
              <Link to={`${url}/${room._id}`}>
                <div className={"lista-chat-item " + (room._id === getRoomName() ? 'chat-ativo' : '')} key={room._id}>
                  <h4>{room.nome}</h4>
                  <span>Fulano: blablablabla</span>
                </div>  
              </Link>
            )
          })}
        </div>
        
      </div>    
        <Switch>
          <Route path={`${url}/:roomName`}>
            <ChatGroup />
          </Route>
          {/* <Route path={`${url}`}>
            <Redirect to={`${url}/Grupo Geral`} />
          </Route> */}
        </Switch>
    </div>
  )
}

export default Chat;