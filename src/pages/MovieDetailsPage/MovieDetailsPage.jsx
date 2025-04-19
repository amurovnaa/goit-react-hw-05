import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { fetchMovieDetails } from "../../services/api";
import {
  useParams,
  useLocation,
  useNavigate,
  NavLink,
  Outlet,
} from "react-router-dom";
import GoBackBtn from "../../components/GoBackBtn/GoBackBtn";
import s from "./MovieDetailsPage.module.css";

const MovieDetailsPage = () => {
  const [movie, setMovie] = useState({});
  const [isError, setIsError] = useState(false);
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const handleClick = () => navigate(location.state?.from ?? "/movies");
  useEffect(() => {
    const abortController = new AbortController();
    const getMovieDetails = async () => {
      try {
        const data = await fetchMovieDetails(movieId, abortController.signal);
        setMovie(data);
        if (data.length === 0) {
          toast.error("No details about movie found...");
        }
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setIsError(true);
          toast.error("Try again later...");
        }
      }
    };
    getMovieDetails();
    return () => {
      abortController.abort();
    };
  }, [movieId]);

  const getYear = (date) => new Date(date).getFullYear();
  const getUserScorePercent = (num) => {
    return Math.round((num / 1000) * 100);
  };
  const linkIsActive = ({ isActive }) => (isActive ? s.active : s.link);
  return (
    <div className={s.moviePageContainer}>
      {console.log(movie)}
      <GoBackBtn onClick={handleClick} />
      {movie && (
        <div className={s.detailsContainer}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={s.img}
          />
          <div className={s.textContainer}>
            <h1 className={s.title}>
              {movie.title} ({getYear(movie.release_date)})
            </h1>
            <div className={s.detailWrap}>
              <h2 className={s.rateName}>
                User Score: {getUserScorePercent(movie.popularity)}%
              </h2>
            </div>
            <div className={s.detailWrap}>
              <h2 className={s.rateName}>Overview:</h2>
              <span>{movie.overview}</span>
            </div>
            {movie.genres && (
              <div className={s.detailWrap}>
                <h2 className={s.rateName}>Genres</h2>
                <ul className={s.genresList}>
                  {movie.genres.map(({ name, id }) => (
                    <li key={id}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className={s.linksList}>
              <h3>Additional Information:</h3>
              <NavLink
                to={`/movies/${movieId}/cast`}
                state={location.state}
                className={linkIsActive}
              >
                <p>Cast</p>
              </NavLink>
              <NavLink
                to={`/movies/${movieId}/reviews`}
                state={location.state}
                className={linkIsActive}
              >
                <p>Reviews</p>
              </NavLink>
              <div className="s.lineContainer">
                <hr className={s.line} />
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};
export default MovieDetailsPage;
