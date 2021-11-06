import React, {
  FormEvent,
  FormEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router";
import { Socket } from "socket.io-client";
import moment from "moment";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { AxiosResponse } from "axios";

type MensagemType = {
  _id: string;
  texto: string;
  autor: { _id: string; nome: string };
  room: { _id: string; nome: string };
  createdAt: string;
};

type Room = {
  _id: string;
  nome: string;
};

const ChatGroup = (props: { socket: Socket }) => {
  const { socket } = props;
  const { user } = useAuth();

  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState<MensagemType[]>([]);
  const [room, setRoom] = useState<Room>();

  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    const onLoad = async () => {
      const response: AxiosResponse<Room> = await api.get(`/room/${roomId}`);
      const roomResponse: Room = response.data;
      setRoom(roomResponse);
    };
    onLoad();
  }, [roomId]);

  useEffect(() => {
    socket.emit("select_room", { roomId }, (call: MensagemType[]) => {
      setMensagens(call);
    });
  }, [roomId]);

  useEffect((): any => {
    const addMsg = (params: any) => {
      setMensagens([...mensagens, params]);
    };

    socket.on("message", addMsg);
    return () => socket.off("message", addMsg);
  }, [mensagens]);

  const handlerSendText = (event: any) => {
    if (event.key === "Enter") {
      socket.emit("message", { texto, room: roomId, autor: user?.id });
      setTexto("");
    }
  };

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [mensagens]);

  const formatDate = (date: string) => {
    const dataFormat = moment(date);
    return dataFormat.format("H:mm");
  };

  return (
    <div className="chat">
      <div className="chat-header">{room?.nome}</div>
      <div className="chat-chat">
        <div className="chat-container">
          {mensagens.map((mensagem) => {
            return (
              <div
                key={mensagem._id}
                className={
                  "chat-mensagem " +
                  (user?.id === mensagem.autor._id ? "minha-msg" : "msg-outro")
                }
              >
                <p>
                  {mensagem.autor.nome} às {formatDate(mensagem.createdAt)}
                </p>
                <p>{mensagem.texto}</p>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat-campo">
        <input
          type="text"
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          onKeyPress={handlerSendText}
        />
      </div>
    </div>
  );
};

export { ChatGroup };
