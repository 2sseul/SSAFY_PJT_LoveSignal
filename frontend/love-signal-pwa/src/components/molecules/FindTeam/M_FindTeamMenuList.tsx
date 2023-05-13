import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./styles/M_FindTeamMenuList.module.scss";
import Button_Type_A from "../../UI/Common/Button_Type_A";
import Modal_portal from "../../UI/Modal/Modal_portal";
import CommonModal from "../../UI/Modal/CommonModal";
import M_ModalFindTeamWithCode from "./M_ModalFindTeamWithCode";
import { getMyTeam, joinTeam } from "../../../api/team";
import {
  kid,
  myMemberUUID,
  myTeamUUID,
  myatk,
  teamBuildState,
} from "../../../atom/member";
import { useRecoilState } from "recoil";
import { makeTeam } from "../../../api/team";

import Ground from "../../UI/Three/Ground";
import { validRoomId } from "../../../atom/member";
import MatchTeam from "../../pages/FindTeam/MatchTeam";

let timeout: NodeJS.Timer;

const M_FindTeamMenuList = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [myUUID] = useRecoilState<string>(myMemberUUID);
  const [enterTeamUUID, setEnterTeamUUID] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [animation, setAnimation] = useState<boolean>(false);

  const [, setTeamUUID] = useRecoilState<string>(myTeamUUID);
  const [atk] = useRecoilState<string>(myatk);
  const [kID] = useRecoilState<string>(kid);
  const [isErr, setIsErr] = useRecoilState<boolean>(validRoomId);
  const [myTeamBuildState, setMyTeamBuildState] =
    useRecoilState<boolean>(teamBuildState);

  //모달창 열어주는 함수입니다.
  const openRoomCodeModalHandler = () => {
    setAnimation(false);
    clearTimeout(timeout);
    setVisible(true);
  };

  //팀으로 입장.(임시);
  const enterTeam = () => {
    //여기에서 axios요청을해서 해당 팀으로 입장.
    joinTeam(myUUID, enterTeamUUID, atk, kID)
      .then((res) => {
        setIsErr(false);
        console.log(res);
        //여기서 setTeamUUID를 설정해야합니다.
        setTeamUUID(enterTeamUUID);
        getMyTeam(enterTeamUUID, atk, kID).then((res) => {
          if (res.data.body.members.length === 3) {
            navigate("/Samegender/myTeam", { replace: true });
          } else {
            navigate("/Samegender/build", { replace: true });
          }
        });
      })
      .catch((err) => {
        if (err.response.status <= 500) {
          setErrMsg(err.response.data.message);
        } else {
          setErrMsg("관리자에게 문의 부탁드립니다.");
        }
        setIsErr(true);
        console.log(err);
      });
  };

  // 새로운 방을 생성해서 이동
  const createRoom = () => {
    console.log(animation);
    // clearTimeout(timeout);
    setAnimation(false);
    setIsPending(true);
    makeTeam(myUUID, atk, kID)
      .then((res) => {
        console.log(res.data); // 방 정보
        setTeamUUID(res.data.body);
        setIsPending(false);
        navigate("/SameGender/build", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setIsPending(false);
      });
  };

  //빠른 매칭
  const fastMatch = () => {
    setAnimation(false);
    setMyTeamBuildState(true);
    //매칭을 시작한다는 axios를 보내주어야 합니다.
    setIsPending(true);
  };

  return (
    <>
      {myTeamBuildState ? (
        <>
          <MatchTeam />
        </>
      ) : (
        <>
          {isPending && (
            <Modal_portal>
              <Ground />
            </Modal_portal>
          )}
          {!isPending && (
            <div className={style.menuList}>
              <Button_Type_A className={style.menu} onClick={fastMatch}>
                <img src="/assets/LIGHTENING.png" />
                빠른 매칭 <img src="/assets/LIGHTENING.png" />
              </Button_Type_A>
              <Button_Type_A className={style.menu} onClick={createRoom}>
                <img src="/assets/SWEET_HOME.png" />
                룸 생성하기
                <img src="/assets/SWEET_HOME.png" />
              </Button_Type_A>
              <Button_Type_A
                className={style.menu}
                onClick={openRoomCodeModalHandler}
              >
                <img src="/assets/KEY.png" />
                룸 검색하기
                <img src="/assets/KEY.png" />
              </Button_Type_A>
            </div>
          )}
          {visible && (
            <Modal_portal>
              <CommonModal
                timeout={timeout}
                animation={animation}
                setAnimation={setAnimation}
                setVisible={setVisible}
                visible={visible}
                width="304px"
                height="200px"
              >
                <M_ModalFindTeamWithCode
                  isErr={isErr}
                  enterTeam={enterTeam}
                  setEnterTeamUUID={setEnterTeamUUID}
                  errMsg={errMsg}
                />
              </CommonModal>
            </Modal_portal>
          )}
        </>
      )}
    </>
  );
};

export default M_FindTeamMenuList;
