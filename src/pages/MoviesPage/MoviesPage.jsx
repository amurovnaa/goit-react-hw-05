import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import MovieList from "../../components/MovieList/MovieList";
import SearchForm from "../../components/SearchForm/SearchForm";
import { fetchMoviesByQuery } from "../../services/api";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useSearchParams } from "react-router-dom";

const MoviesPage = () => {
  const [movies, setMovies] = useState({ results: [], total_pages: 1 });
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const [isError, setIsError] = useState(false);

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
    getMovies();

    return () => {
      abortController.abort();
    };
  }, [page]);
  const handleChangeQuery = (newValue) => {
    if (!newValue) {
      searchParams.delete("query");
      return setSearchParams(searchParams);
    }
    searchParams.set("query", newValue);
    // searchParams.set('test', 12345);
    // searchParams.set('size', 'sm');
    // searchParams.set('isLoggedIn', true);
    setSearchParams(searchParams);
  };
  const filteredData = movies.results.filter(
    (movie) => movie.title.toLowerCase().includes(query.toLowerCase())
    // user.lastName.toLowerCase().includes(query.toLowerCase())
  );
  const nextPage = page + 1;
  const changeTotalPages = movies.total_pages - nextPage;
  const handleLoadMore = () => {
    setPage(nextPage);
  };
  return (
    <>
      {console.log(movies)}
      <SearchForm handleChangeQuery={handleChangeQuery} />
      <MovieList dataMovies={filteredData} />
      {changeTotalPages > -1 && <LoadMoreBtn onClick={handleLoadMore} />}
      <Toaster position="top-right" />
    </>
  );
};
export default MoviesPage;
