import MovieList from "../../components/MovieList/MovieList";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { fetchTrendingMovies } from "../../services/api";
import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
const HomePage = () => {
  const [movies, setMovies] = useState({ results: [], total_pages: 1 });
  const [page, setPage] = useState(1);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const abortController = new AbortController();

    const getTrendingMovies = async () => {
      try {
        const data = await fetchTrendingMovies(page, abortController.signal);
        setMovies((prev) => ({
          results: [...prev.results, ...data.results],
          total_pages: data.total_pages,
        }));
        if (data.results.length === 0) {
          toast.error("No movies found...");
        }
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setIsError(true);
          toast.error("Try again later...");
        }
      }
    };
    getTrendingMovies();
    return () => {
      abortController.abort();
    };
  }, [page]);

  const nextPage = page + 1;
  const changeTotalPages = movies.total_pages - nextPage;
  const handleLoadMore = () => {
    setPage(nextPage);
  };
  return (
    <>
      {console.log(movies)}
      <h1>Trending Today</h1>
      <MovieList dataMovies={movies.results} />
      {changeTotalPages > -1 && <LoadMoreBtn onClick={handleLoadMore} />}
      <Toaster position="top-right" />
    </>
  );
};
export default HomePage;
