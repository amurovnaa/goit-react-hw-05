import { Link } from "react-router-dom";
import s from "./MovieList.module.css";

const MovieList = ({ dataMovies, prevLocation }) => {
  return (
    <div className={s.wrapper}>
      <ul className={s.list}>
        {dataMovies.map(({ id, title }) => (
          <li className={s.item} key={id}>
            <Link state={{ from: prevLocation }} to={`/movies/${id}`}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MovieList;
