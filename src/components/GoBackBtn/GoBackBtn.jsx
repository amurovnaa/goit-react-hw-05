import s from "./GoBackBtn.module.css";

const GoBackBtn = ({ onClick }) => {
  return (
    <>
      <button className={s.button} onClick={() => onClick()}>
        Go Back
      </button>
    </>
  );
};
export default GoBackBtn;
