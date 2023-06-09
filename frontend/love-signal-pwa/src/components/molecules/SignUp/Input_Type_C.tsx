import { Dispatch, SetStateAction } from "react";
import style from "./styles/Input_Type_C.module.scss";
import A_MaleLabel from "../../atoms/SignUp/A_MaleLabel";
import A_FemaleLabel from "../../atoms/SignUp/A_FemaleLabel";

type propsType = {
  gender: string;
  setGender: Dispatch<SetStateAction<string>>;
};

const Input_Type_C: React.FC<propsType> = ({ gender, setGender }) => {
  const changeGender = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement;
    setGender(target.value);
  };
  return (
    <div className={style.radioBtn}>
      <A_MaleLabel gender={gender} changeGender={changeGender} />
      <A_FemaleLabel gender={gender} changeGender={changeGender} />
    </div>
  );
};

export default Input_Type_C;
