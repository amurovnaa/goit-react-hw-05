import { Link, useLocation } from "react-router-dom";

const MovieList = ({ dataMovies, prevLocation }) => {
  return (
    <ul>
      {dataMovies.map(({ id, title }) => (
        <li key={id}>
          <Link state={{ from: prevLocation }} to={`/movies/${id}`}>
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default MovieList;
