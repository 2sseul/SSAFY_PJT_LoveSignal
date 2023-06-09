import style from "./styles/SignUp.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M_SignUp_Profile from "../../molecules/SignUp/M_SignUp_Profile";
import M_SignUp_Birth from "../../molecules/SignUp/M_SignUp_Birth";
import M_SignUp_Nickname from "../../molecules/SignUp/M_SignUp_Nickname";
import A_MainLogo from "../../atoms/SignUp/A_MainLogo";
import M_SignUp_Introduce from "../../molecules/SignUp/M_SignUp_Introduce";
import {
  duplicateCheck,
  inquireMember,
  login,
  signUp,
} from "../../../api/auth";
import M_SignUp_Gender from "../../molecules/SignUp/M_SignUp_Gender";
import { useRecoilState } from "recoil";
import {
  imLeader,
  kid,
  myGender,
  myMemberUUID,
  myatk,
  myatkET,
} from "../../../atom/member";
import { changeMyImg } from "../../../api/file";
import cookie from "react-cookies";
import { motion } from "framer-motion";
import { contentVariants } from "../../atoms/Common/contentVariants";

const SignUp = () => {
  const navigate = useNavigate();
  //회원 가입시 필요한 개인 정보들.
  const [birth, setBirth] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [description, setDiscription] = useState<string>("");
  const [gender, setGender] = useState<string>("M");

  //회원 가입시 다음으로 넘어가게 만들어주는 boolean 변수들.
  const [checkNickname, setCheckNickname] = useState<boolean>(false);
  const [checkProfileOk, setCheckProfileOk] = useState<boolean>(false);
  const [checkNickOk, setCheckNickOk] = useState<boolean>(false);
  const [checkBirthOk, setCheckBirthOk] = useState<boolean>(false);
  const [checkGenderOk, setCheckGenderOk] = useState<boolean>(false);

  //회원가입 관련 변수들
  const [atk, setAtk] = useRecoilState<string>(myatk);
  const [, setAtkET] = useRecoilState<Date>(myatkET);
  const [kakaoId, setKakaoId] = useRecoilState<string>(kid);
  const [myImage, setMyImage] = useState<FormData>(new FormData());
  const [, setMemberUUID] = useRecoilState<string>(myMemberUUID);
  const [msg, setMsg] = useState<string>("");
  const [checkMsg, setCheckMsg] = useState<string>("");

  const [, setMyGender] = useRecoilState<string>(myGender);
  const [, setMUUID] = useRecoilState<string>(myMemberUUID);
  const [, setLeader] = useRecoilState<boolean>(imLeader);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("code");

    let env: string = "";

    if (window.location.hostname === "localhost") {
      env = "localhost";
    }

    if (queryParam) {
      login(queryParam, env)
        .then(async (res) => {
          saveMyInfo(
            res.data.body.accessToken,
            res.data.body.refreshToken,
            res.data.body.accessTokenExpireTime,
            res.data.body.refreshTokenExpireTime,
            res.data.body.kakaoId,
            res.data.body.memberUUID
          );
          if (res.data.body.memberUUID !== null) {
            await inquireMember(
              res.data.body.memberUUID,
              res.data.body.accessToken,
              res.data.body.kakaoId
            ).then((res) => {
              saveGenderUUID(
                res.data.body.gender,
                res.data.body.memberUUID,
                res.data.body.teamLeader
              );
            });
            navigate("/OtherGender", { replace: true });
            window.location.reload();
          }
        })
        .catch((err) => {});
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  const saveGenderUUID = (
    gender: string,
    memberUUID: string,
    teamLeader: boolean
  ) => {
    setMyGender(gender);
    setMUUID(memberUUID);
    setLeader(teamLeader);
  };

  const saveMyInfo = (
    atk: string,
    rtk: string,
    aTET: number,
    rTET: number,
    kakaoId: string,
    myUUID: string
  ) => {
    setAtk(atk);
    setCookie(rtk, rTET);
    let nowDate: Date = new Date();
    nowDate.setSeconds(nowDate.getSeconds() + aTET);
    setAtkET(nowDate);
    setKakaoId(kakaoId);
    setMemberUUID(myUUID);
  };

  //쿠키를 저장해줄 함수입니다. (회원가입이 완료 되고 나면 rtk를 쿠키에 저장할것. 만료기간 설정.)
  const setCookie = (rtk: string, rTET: number) => {
    const expires = new Date(); //현재 시간 받아오고.
    expires.setSeconds(expires.getSeconds() + rTET); //현재 시간에 만료시간의 초 + 만료기간 더해주기
    cookie.save("rtk", rtk, {
      path: "/", //일단 모든 경로에서 전부 쿠키 쓸수있게 해놓기.
      expires, //만료기간 설정
      secure: true, //보안 설정
      // httpOnly: true, //보안 설정
    });
  };

  const handleProfile = () => {
    setCheckProfileOk(!checkProfileOk);
  };

  const handleNickname = () => {
    if (checkNickname) {
      if (nickname.length !== 0) {
        setCheckNickOk(!checkNickOk);
      }
    } else {
      setCheckMsg("중복확인을 체크해주세요.");
    }
  };

  const handleBirth = () => {
    if (birth.length === 8) {
      //다 입력되어야지 바꿔줄수있다.
      setCheckBirthOk(!checkBirthOk);
    }
  };

  const handleGender = () => {
    setCheckGenderOk(!checkGenderOk);
  };

  //중복확인 해주는 함수입니다.
  const duplecheck = () => {
    duplicateCheck(nickname)
      .then((res) => {
        //닉네임 중복확인입니다.
        setCheckNickname(true); //중복확인 체크되었다는걸 말해줌.
        setMsg(res.data.body);
      })
      .catch((err) => {
        //이미 있는 닉네임이면 안돼.
        setMsg(err.response.data.message);
      });
  };

  //회원가입 버튼 클릭했을때
  const registMember = () => {
    if (description.length !== 0) {
      signUp(nickname, gender, birth, description, atk)
        .then(async (res) => {
          setMemberUUID(res.data.body);
          await changeMyImg(res.data.body, myImage, atk, kakaoId)
            .then(() => {
              navigate("/Manual");
              window.location.reload();
            })
            .catch((err) => {
              alert(err.response.data.message);
            });
        })
        .catch((err) => {});
    }
  };

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      // exit="exit"
      className={`${style.Container} diagonal-gradient`}
    >
      <div className={style.center}>
        <A_MainLogo />
        {!checkProfileOk && !checkNickOk && !checkBirthOk && !checkGenderOk && (
          <M_SignUp_Profile onClick={handleProfile} setMyImage={setMyImage} />
        )}
        {checkProfileOk && !checkNickOk && !checkBirthOk && !checkGenderOk && (
          <M_SignUp_Nickname
            nickname={nickname}
            onClick1={duplecheck}
            onClick2={handleNickname}
            setNickname={setNickname}
            checkNickname={checkNickname}
            setCheckNickname={setCheckNickname}
            msg={msg}
            setMsg={setMsg}
            checkMsg={checkMsg}
            setCheckMsg={setCheckMsg}
          />
        )}
        {checkProfileOk && checkNickOk && !checkBirthOk && !checkGenderOk && (
          <M_SignUp_Birth onClick={handleBirth} setBirth={setBirth} />
        )}
        {checkProfileOk && checkNickOk && checkBirthOk && !checkGenderOk && (
          <M_SignUp_Gender
            gender={gender}
            onClick={handleGender}
            setGender={setGender}
          />
        )}
        {checkProfileOk && checkNickOk && checkBirthOk && checkGenderOk && (
          <M_SignUp_Introduce
            description={description}
            onClick={registMember}
            setDiscription={setDiscription}
          />
        )}
      </div>
    </motion.div>
  );
};

export default SignUp;
