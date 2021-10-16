import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Socket } from 'socket.io-client';
import moment  from 'moment';
import { useAuth } from '../hooks/useAuth';

type MensagemType = {
  _id: string;
  texto: string;
  autor: { _id: string, nome: string};
  room: { _id: string, nome: string};
  createdAt: string; 
}


const ChatGroup = (props: { socket: Socket }) => {
  const {socket} = props;
  const { user } = useAuth();
  
  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState<MensagemType[]>([]);

  const { roomName } = useParams<{roomName: string}>();


  useEffect(() => {
    socket.emit("select_room", {roomName}, (call: MensagemType[]) => {
      console.log(call)
      setMensagens(call);
    });
  },[roomName])

  useEffect((): any => {
    const addMsg = (params: any) => {
      console.log(params)
      setMensagens([...mensagens, params])
    }

    socket.on("message", addMsg);
    return () => socket.off("message", addMsg);
  },[mensagens])

  const handlerSendText = () => {

    // console.log({texto, room: roomName, user: user?.id});
    socket.emit("message", {texto, room: roomName, autor: user?.id});
    setTexto('');
  }
  
  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [mensagens]);

  const formatDate = (date: string) => {
    const dataFormat = moment(date);
    return dataFormat.format("H:mm");
  }

  return (
      
    <div className="chat">     
      <div className="chat-header">{roomName}</div>
        <div className="chat-chat">
          <div className="chat-container">
            {mensagens.map((mensagem) => {
              return (
                <div  key={mensagem._id} className={"chat-mensagem " + (user?.id === mensagem.autor._id ? 'minha-msg' : 'msg-outro')}>
                  <p>{mensagem.autor.nome} às {formatDate(mensagem.createdAt)}</p>
                  <p>{mensagem.texto}</p>
                </div>
              )
            })}
          </div>
          <div ref={messagesEndRef}></div>
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