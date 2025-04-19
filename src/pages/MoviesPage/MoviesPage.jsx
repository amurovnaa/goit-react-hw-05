import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import MovieList from "../../components/MovieList/MovieList";
import SearchForm from "../../components/SearchForm/SearchForm";
import { fetchMoviesByQuery } from "../../services/api";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useSearchParams } from "react-router-dom";
import s from "./MoviesPage.module.css";

const MoviesPage = () => {
  const [movies, setMovies] = useState({ results: [], total_pages: 1 });
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isError, setIsError] = useState(false);

  const location = useLocation();
  const query = searchParams.get("query") ?? "";
  const savedPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const abortController = new AbortController();
    const getMovies = async () => {
      try {
        const data = await fetchMoviesByQuery(
          query,
          page,
          abortController.signal
        );
        setMovies((prev) => ({
          results: [...prev.results, ...data.results],
          total_pages: data.total_pages,
        }));
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setIsError(true);
          toast.error("Try again later...");
        }
      }
    };
    getMovies();

    return () => {
      abortController.abort();
    };
  }, [query, page]);

  useEffect(() => {
    setPage(savedPage);
  }, [savedPage]);

  const handleChangeQuery = (newValue) => {
    const params = new URLSearchParams();
    if (newValue) {
      params.set("query", newValue);
      params.set("page", "1");
    }
    setMovies({ results: [], total_pages: 1 });
    setSearchParams(params);
  };
  const filteredData = movies.results.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
  const newPage = page + 1;
  const changeTotalPages = movies.total_pages - newPage;
  const handleLoadMore = () => {
    setPage(newPage);
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };
  return (
    <>
      {console.log(movies)}
      <SearchForm handleChangeQuery={handleChangeQuery} />
      {query === "" ? (
        <p className={s.info}>Start your movie search</p>
      ) : filteredData.length === 0 ? (
        <p className={s.info}>No movies found</p>
      ) : (
        <MovieList dataMovies={filteredData} prevLocation={location} />
      )}

      {changeTotalPages > -1 && <LoadMoreBtn onClick={handleLoadMore} />}
      <Toaster position="top-right" />
    </>
  );
};
export default MoviesPage;
