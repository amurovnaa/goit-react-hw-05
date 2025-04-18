import { Link, useLocation } from "react-router-dom";

const MovieList = ({ dataMovies }) => {
  const location = useLocation();
  console.log(location);
  return (
    <ul>
      {dataMovies.map(({ id, title }) => (
        <li key={id}>
          <Link state={location} to={`/movies/${id}`}>
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default MovieList;
