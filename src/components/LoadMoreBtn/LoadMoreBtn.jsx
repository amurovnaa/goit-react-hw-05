import s from "./LoadMoreBtn.module.css";

const LoadMoreBtn = ({ onClick }) => {
  return (
    <div className={s.wrapper}>
      <button className={s.button} type="button" onClick={() => onClick()}>
        Load more
      </button>
    </div>
  );
};
export default LoadMoreBtn;
