import "./../styles/chat.scss";

import { AxiosResponse } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { ChatGroup } from "./ChatGroup";
import { io } from "socket.io-client";
import moment from "moment";

type RoomType = {
  _id: string;
  nome: string;
  ultimaMensagem: {
    texto: string;
    autor: { nome: string };
    createdAt: string;
  } | null;
};

const socket = io("localhost:3333");

const Chat = () => {
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectou no socket!");
    });
  }, []);

  useEffect((): any => {
    const addMsg = (data: any) => {
      console.log(data);
      const room = rooms.find((r) => r._id === data.room._id) as RoomType;
      room.ultimaMensagem = {
        texto: data.texto,
        autor: { nome: data.autor.nome },
        createdAt: data.createdAt,
      };
      const roomsMaped = rooms.map((r) => {
        if (r._id === data.room._id) {
          return room;
        }
        return r;
      });
      setRooms(roomsMaped);
    };

    socket.on("last_message", addMsg);
    return () => socket.off("last_message", addMsg);
  }, [rooms]);

  useEffect(() => {
    const onLoad = async () => {
      const response: AxiosResponse<RoomType[]> = await api.get("/room");
      const roomsResponse: RoomType[] = response.data;
      setRooms(roomsResponse);
    };

    onLoad();
  }, [isAuthenticated]);

  const getRoomName = () => {
    return pathname.split("/")[2];
  };

  const formatDate = (date: string) => {
    const dataFormat = moment(date);
    return dataFormat.format("H:mm");
  };

  return (
    <div className="tudo">
      <div className="grupos">
        <h2>Mural do Carlos</h2>
        <div className="lista-chat">
          {rooms.map((room) => {
            return (
              <Link to={`${url}/${room._id}`} key={room._id}>
                <div
                  className={
                    "lista-chat-item " +
                    (room._id === getRoomName() ? "chat-ativo" : "")
                  }
                >
                  <h4>{room.nome}</h4>
                  {room.ultimaMensagem ? (
                    <span>
                      {formatDate(room.ultimaMensagem.createdAt)}{" "}
                      {room.ultimaMensagem?.autor.nome}:{" "}
                      {room.ultimaMensagem?.texto}
                    </span>
                  ) : (
                    <span>---</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Switch>
        <Route exact path={path}>
          <h3>Please select a Room.</h3>
        </Route>
        <Route path={`${path}/:roomId`}>
          <ChatGroup socket={socket} />
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={`${path}`} />
        </Route>
      </Switch>
    </div>
  );
};

export default Chat;
