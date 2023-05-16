import React, { Dispatch, SetStateAction } from "react";
import style from "./styles/O_ChatTextBox.module.scss";
import M_ChatTopNotice from "../../molecules/Chat/M_ChatTopNotice";
import O_ChatTextList from "./O_ChatTextList";
import M_ChatInputBox from "../../molecules/Chat/M_ChatInputBox";
import { chat } from "../../../types/chat";
import { member } from "../../../types/member";

type PropsType = {
  onTextSubmit(text: string): void;
  roomType?: string;
  ulRef: React.RefObject<HTMLUListElement>;
  chatList: chat[];
  members: member[] | null;
  onRoomExit: (type: number) => void;
  setOppositeTeamMember: Dispatch<SetStateAction<member[]>>;
  setOppositeTeamUUID: Dispatch<SetStateAction<string>>;
  viewDetail: () => void;
};

const O_ChatTextBox: React.FC<PropsType> = ({
  onTextSubmit,
  roomType,
  ulRef,
  chatList,
  members,
  onRoomExit,
  setOppositeTeamMember,
  setOppositeTeamUUID,
  viewDetail,
}) => {
  return (
    <div className={style.textContainer}>
      <M_ChatTopNotice
        icon={`${process.env.REACT_APP_ASSETS_DIR}/notice_A.png`}
        text="매일 저녁 10시에는 선택의 시간이 진행됩니다."
        width="90%"
        background="rgba(235, 235, 235, 0.8)"
        doTimeCount={roomType === "ANONYMOUS" ? true : false}
        className={style.topNotice}
        onRoomExit={onRoomExit}
      />
      <O_ChatTextList
        ulRef={ulRef}
        roomType={roomType}
        chatList={chatList}
        members={members}
        setOppositeTeamMember={setOppositeTeamMember}
        setOppositeTeamUUID={setOppositeTeamUUID}
        viewDetail={viewDetail}
      />
      <M_ChatInputBox
        onTextSubmit={onTextSubmit}
        isDisabled={roomType === "SYSTEM" ? true : false}
      />
    </div>
  );
};

export default O_ChatTextBox;
