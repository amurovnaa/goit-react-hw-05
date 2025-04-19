import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieCast } from "../../services/api";
import { toast, Toaster } from "react-hot-toast";
import s from "./MovieCast.module.css";

const MovieCast = () => {
  const [credits, setCredits] = useState({});
  const [isError, setIsError] = useState();
  const { movieId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const getMovieCast = async () => {
      try {
        const data = await fetchMovieCast(movieId, abortController.signal);
        setCredits(data);
        if (data.length === 0) {
          toast.error("There is no information about movies cast...");
        }
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setIsError(true);
          toast.error("Try again later...");
        }
      }
    };
    getMovieCast();
    return () => {
      abortController.abort();
    };
  }, [movieId]);
  return (
    <div className={s.wrapper}>
      {console.log(credits.cast)}
      {credits.cast?.length > 0 ? (
        <ul className={s.list}>
          {credits.cast.map(({ name, character, id, profile_path }) => {
            return (
              <li key={id} className={s.item}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${profile_path}`}
                  alt={name}
                  className={s.img}
                />
                <p>{name}</p>
                <p>Character: {character}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>There is no information about movies cast...</p>
      )}
      <Toaster position="top-right" />
    </div>
  );
};
export default MovieCast;
