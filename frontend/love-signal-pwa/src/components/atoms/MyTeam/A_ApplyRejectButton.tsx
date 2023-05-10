import { Dispatch, SetStateAction } from "react";
import Button_Type_A from "../../UI/Common/Button_Type_A";
import { kid, myMemberUUID, myatk } from "../../../atom/member";

import { rejectMeeting } from "../../../api/team";
import { imLeader } from "../../../atom/member";
import { useRecoilState } from "recoil";

type propsType = {
  oppsiteTeamUUID: string;
  clickBtn: boolean;
  setClickBtn: Dispatch<SetStateAction<boolean>>;
};

const A_ApplyRejectButton: React.FC<propsType> = ({
  oppsiteTeamUUID,
  clickBtn,
  setClickBtn,
}) => {
  const [myUUID] = useRecoilState<string>(myMemberUUID);
  const [isLeader] = useRecoilState<boolean>(imLeader);
  const [atk] = useRecoilState<string>(myatk);
  const [kID] = useRecoilState<string>(kid);
  //팀 거절을 눌렀을때.
  const rejectTeam = async () => {
    if (isLeader) {
      await rejectMeeting(myUUID, oppsiteTeamUUID, atk, kID);
      setClickBtn(!clickBtn);
    }
  };

  return (
    <Button_Type_A
      width="56px"
      height="32px"
      background={isLeader ? "#ffadb6" : "#BCBCBC"}
      disabled={isLeader}
      onClick={rejectTeam}
    >
      {isLeader ? (
        <img src="/assets/btn_reject.png" onClick={rejectTeam} />
      ) : (
        <img src="/assets/btn_blackreject.png" />
      )}
    </Button_Type_A>
  );
};

export default A_ApplyRejectButton;
