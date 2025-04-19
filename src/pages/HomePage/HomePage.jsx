import MovieList from "../../components/MovieList/MovieList";
import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { fetchTrendingMovies } from "../../services/api";
import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import s from "./HomePage.module.css";

const HomePage = () => {
  const [movies, setMovies] = useState({ results: [], total_pages: 1 });
  const [page, setPage] = useState(1);
  const [isError, setIsError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  const savedPage = parseInt(searchParams.get("page")) || 1;

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

  useEffect(() => {
    if (savedPage > 1) {
      setPage(savedPage);
    }
  }, [savedPage]);

  const handleLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };
  return (
    <>
      {console.log(movies)}
      <h1 className={s.title}>Trending Today</h1>
      <MovieList dataMovies={movies.results} prevLocation={location} />
      {page < movies.total_pages && <LoadMoreBtn onClick={handleLoadMore} />}
      <Toaster position="top-right" />
    </>
  );
};
export default HomePage;
