import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { io } from "socket.io-client";

import { useAuth } from '../hooks/useAuth';

// const MENSAGENS = [
//   {texto: "aaaaaaaaaaaaaaaaa", autor: "fulano de tal", hora: "20:05"},
//   {texto: "ddddddddddddddddd", autor: "61688289f64ec13917e4c35f", hora: "20:05"},
//   {texto: "bbbbbbbbbbbbbbbbb", autor: "fulano de tal", hora: "20:05"},
//   {texto: "aaaaaaaaaaaaaaaaa", autor: "fulano de tal", hora: "20:05"},
//   {texto: "ccccccccccccccccc", autor: "61688289f64ec13917e4c35f", hora: "20:05"},
//   {texto: "fffffffffffffffff", autor: "fulano de tal", hora: "20:05"},
// ]



type MensagemType = {
  _id: string;
  texto: string;
  autor: { _id: string, nome: string};
  room: { _id: string, nome: string};
  createdAt: string; 
}

const socket = io("localhost:3333");

socket.on("connect", () => {
  console.log("Conectou no socket!")
})



const ChatGroup = () => {
  const { user } = useAuth();
  
  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState<MensagemType[]>([]);

  const { roomName } = useParams<{roomName: string}>();

  useEffect(() => {
    socket.emit("first_access", {roomName}, (call: MensagemType[]) => {
      setMensagens(call);
    });
  },[roomName])

  socket.on("nova_msg", (params) => {
    setMensagens([...mensagens, params])
  })

  const handlerSendText = () => {

    console.log({texto, room: roomName, user: user?.id});
    socket.emit("message", {texto, room: roomName, autor: user?.id}, (call: any) => {
      setMensagens([...mensagens, call])
    });
    setTexto('');
  }


  return (
      
    <div className="chat">     
      <div className="chat-header">{roomName}</div>
        <div className="chat-chat">
          <div className="chat-container">
            {mensagens.map((mensagem) => {
              return (
                <div  key={mensagem._id} className={"chat-mensagem " + (user?.id === mensagem.autor._id ? 'minha-msg' : 'msg-outro')}>
                  <p>{mensagem.autor.nome} às {mensagem.createdAt}</p>
                  <p>{mensagem.texto}</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="chat-campo">
          <input 
            type="text"
            value={texto}
            onChange={event => setTexto(event.target.value)}
          />
          <button onClick={handlerSendText}>Send</button>
        </div>
    </div>
  )

}

export { ChatGroup };