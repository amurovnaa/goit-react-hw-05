import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieReviews } from "../../services/api";
import { toast, Toaster } from "react-hot-toast";

const MovieReviews = () => {
  const [reviews, setReviews] = useState({});
  const [isError, setIsError] = useState();
  const { movieId } = useParams();
  useEffect(() => {
    const abortController = new AbortController();
    const getMovieReviews = async () => {
      try {
        const data = await fetchMovieReviews(movieId, abortController.signal);
        setReviews(data);
        if (data.length === 0) {
          toast.error("There is no reviews about movie...");
        }
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setIsError(true);
          toast.error("Try again later...");
        }
      }
    };
    getMovieReviews();
    return () => {
      abortController.abort();
    };
  }, [movieId]);
  const formatDateFull = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      {reviews.total_results > 0 ? (
        <ul>
          {reviews.results.map(({ author, created_at, id, content }) => {
            return (
              <li key={id}>
                <p>Author: {author}</p>
                <p>{formatDateFull(created_at)}</p>
                <p>{content}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>There is no reviews about movie...</p>
      )}
      <Toaster position="top-right" />
    </div>
  );
};
export default MovieReviews;
