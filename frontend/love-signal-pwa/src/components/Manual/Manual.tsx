import { useEffect } from "react";
import style from "./Manual.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "./Manual.css";

import { Pagination, Mousewheel } from "swiper";

import ManualImg from "./ManualImg";
import ManualText1 from "./ManualText1";
import ManualText2 from "./ManualText2";
import ManualText3 from "./ManualText3";
import ManualText4 from "./ManualText4";
import ManualText5 from "./ManualText5";
import ManualText6 from "./ManualText6";
import ManualTitle from "./ManualTitle";
import { useNavigate } from "react-router-dom";
import Button_Type_A from "../atoms/Common/Button_Type_A";
import { contentVariants } from "../atoms/Common/contentVariants";
import GetMyInfo from "../Filter/GetMyInfo";
import { useRecoilState } from "recoil";
import { requestPushPermission, sendFCMToken } from "../../api/pwa";
import { getFCMToken } from "../../firebase";
import { setPushAlarmStatus } from "../../api/auth";
import { kid, myMemberUUID, myatk, nickname } from "../../atom/member";

const Manual = () => {
  const [UUID] = useRecoilState<string>(myMemberUUID);
  const [myNick] = useRecoilState<string>(nickname);
  const [atk] = useRecoilState<string>(myatk);
  const [kID] = useRecoilState<string>(kid);
  const navigate = useNavigate();

  useEffect(() => {
    if (UUID && myNick && atk && kID) {
      requestPushPermission(UUID)
        .then((permission) => {
          if (permission === "granted") {
            getFCMToken()
              .then((token) => {
                sendFCMToken(UUID, myNick, atk, kID, token);
                setPushAlarmStatus(UUID, atk, kID, "true");
              })
              .catch((err) => {
                console.error("토큰 발급 에러 : ", err);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const goToMain = () => {
    navigate("/OtherGender");
  };
  return (
    <GetMyInfo>
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className={style.mainContainer}
      >
        <div className={style.cellphoneModal}>
          <Swiper
            pagination={{
              dynamicBullets: true,
              clickable: true,
            }}
            mousewheel={{
              invert: true,
            }}
            modules={[Pagination, Mousewheel]}
            className="mySwiper"
          >
            <SwiperSlide className={style.swiperSlide}>
              <div className={style.modalContainer}>
                <ManualTitle />
                <ManualText1 />
                <ManualImg num="1" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={style.modalContainer}>
                <ManualTitle />
                <ManualText2 />
                <ManualImg num="2" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={style.modalContainer}>
                <ManualTitle />
                <ManualText3 />
                <ManualImg num="3" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={style.modalContainer}>
                <ManualTitle />
                <ManualText4 />
                <ManualImg num="4" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={style.modalContainer}>
                <ManualTitle />
                <ManualText5 />
                <ManualImg num="5" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={style.modalContainer}>
                <ManualTitle />
                <ManualText6 />
                <Button_Type_A
                  onClick={goToMain}
                  width="70%"
                  height="40px"
                  background="#FBCED3"
                >
                  러브시그널 시작하기
                </Button_Type_A>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </motion.div>
    </GetMyInfo>
  );
};

export default Manual;
