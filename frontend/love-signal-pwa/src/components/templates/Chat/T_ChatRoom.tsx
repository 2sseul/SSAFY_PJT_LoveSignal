import React, { useEffect, useState, useRef } from "react";
import style from "./styles/T_ChatRoom.module.scss";
import M_ChatRoomHeader from "../../molecules/Chat/M_ChatRoomHeader";
import O_ChatTextBox from "../../organisms/Chat/O_ChatTextBox";
import { chat } from "../../../types/chat";

import { useRecoilState } from "recoil";
import { nickname } from "../../../atom/member";
import { member } from "../../../types/member";

const ENUM_BACKGROUND: { [key: string]: string } = {
  TEAM: "#cad9ff",
  SYSTEM: "#fafbce",
  MEETING: "#fbced3",
  SECRET: "#dccefb",
};
Object.freeze(ENUM_BACKGROUND);

type PropsType = {
  className?: string;
  roomId?: string;
  title?: string;
  roomExitHandler: (type?: number) => void;
  roomType?: string;
  chatList: chat[];
  onTextSend: (text: chat) => void;
  members: member[] | null;
};

const T_ChatRoom: React.FC<PropsType> = ({
  className,
  roomId,
  title,
  roomExitHandler,
  roomType,
  chatList,
  onTextSend,
  members,
}) => {
  const box_chatRoom = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const [unitHeight, setUnitHeight] = useState<number>();
  const [me, _] = useRecoilState<string>(nickname);

  useEffect(() => {
    window.addEventListener("resize", unitHeightSetHandler);
    window.addEventListener("touchend", unitHeightSetHandler);
    window.visualViewport?.addEventListener(
      "resize",
      resizeVisualViewportHandler
    );

    return () => {
      window.removeEventListener("resize", unitHeightSetHandler);
      window.removeEventListener("touchend", unitHeightSetHandler);
      window.visualViewport?.removeEventListener(
        "resize",
        resizeVisualViewportHandler
      );
    };
  }, []);

  useEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = ulRef.current.scrollHeight + 100;
    }
  }, [chatList]);

  const textSendHandler = (content: string) => {
    if (content.trim().length < 1) return;

    const newChat: chat = {
      type: "TEXT",
      roomUUID: roomId,
      nickname: me, // 임시 닉네임
      content: content,
    };

    // 채팅 서버에 채팅 publish
    onTextSend(newChat);
  };

  const onRoomExit = () => {
    roomExitHandler();
  };

  const unitHeightSetHandler = () => {
    let vh = window.visualViewport?.height;
    if (!vh) {
      vh = window.innerHeight * 0.01;
    } else {
      vh *= 0.01;
    }
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  const resizeVisualViewportHandler = () => {
    const current = window.visualViewport?.height;
  };

  useEffect(() => {}, [unitHeight]);

  return (
    <div className={`${style.chatRoom} ${className}`} ref={box_chatRoom}>
      <M_ChatRoomHeader
        onRoomExit={onRoomExit}
        roomId={roomId}
        title={title}
        count={members && members.length > 0 ? members.length + "" : ""}
        background={roomType ? ENUM_BACKGROUND[roomType] : ""}
      />
      <O_ChatTextBox
        // onTextSubmit={onTextSend}
        onTextSubmit={textSendHandler}
        onRoomExit={roomExitHandler}
        roomType={roomType}
        ulRef={ulRef}
        chatList={chatList}
        members={members}
      />
    </div>
  );
};

export default T_ChatRoom;
