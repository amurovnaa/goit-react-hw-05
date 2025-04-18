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

const MovieDetailsPage = () => {
  const [movie, setMovie] = useState({});
  const [isError, setIsError] = useState(false);

  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);

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
  const handleClick = () => navigate(location?.state?.from ?? "/");
  const getYear = () => new Date(movie.release_date).getFullYear();
  return (
    <div>
      {console.log(movie)}
      <GoBackBtn onClick={handleClick} />
      {movie && (
        <div>
          <div>
            <h1>
              {movie.title} ({getYear()})
            </h1>
            <div>
              <h2>
                User Score: {Math.round((movie.popularity / 1000) * 100)}%
              </h2>
              <progress value={movie.popularity} max={1000}></progress>
            </div>
            <div>
              <h2>Overview:</h2>
              <span>{movie.overview}</span>
            </div>
            {movie.genres && (
              <div>
                <h2>Genres</h2>
                <ul>
                  {movie.genres.map(({ name, id }) => (
                    <li key={id}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3>Additional Information:</h3>
              <NavLink to={`/movies/${movieId}/cast`} state={location.state}>
                <p>Cast</p>
              </NavLink>
              <NavLink to={`/movies/${movieId}/reviews`} state={location.state}>
                <p>Reviews</p>
              </NavLink>
              <hr />
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
