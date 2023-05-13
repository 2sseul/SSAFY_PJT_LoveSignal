import React from "react";
import style from "./styles/M_ChatSelectBox.module.scss";

type PropsType = {
  nickname: string;
  profile: string;
  selectHandler?: (param: string) => void;
  isSelect?: boolean;
};

const M_ChatSelectBox: React.FC<PropsType> = ({
  nickname,
  profile,
  selectHandler,
  isSelect,
}) => {
  const selectOne = () => {
    if (selectHandler) {
      selectHandler(nickname);
    }
  };

  return (
    <li className={style.selectOneBox}>
      <div className={style.imgBox}>
        <img src={profile} className={style.profileImg} />
      </div>
      {isSelect && (
        <button className={style.selectBtn} onClick={selectOne}>
          <img src={`${"/assets"}/heart with arrow.png`} />
        </button>
      )}
    </li>
  );
};

export default M_ChatSelectBox;
