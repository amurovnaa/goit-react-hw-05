import axios from "axios";

axios.defaults.baseURL = "https://api.themoviedb.org/3";
export const api_key = "279bd91b73440ffa188d0edf6db19db5";
export const api_access_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNzliZDkxYjczNDQwZmZhMTg4ZDBlZGY2ZGIxOWRiNSIsIm5iZiI6MTc0NDk3NTY4OC41OCwic3ViIjoiNjgwMjM3NDhiMTEzZmY4NzIzZDk5YTk4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.FC9W-rs_JYoFcBYhP_o_jm0Y12PRxQRu-ZYG-OyoC";
const end_points = {
  trending: "/trending/movie/day",
  querySearch: "/search/movie",
  movieDetails: "/movie",
  movieCredits: "/credits",
  movieReviews: "/reviews",
};

export const fetchTrendingMovies = async (page, signal) => {
  const res = await axios.get(
    `${end_points.trending}?api_key=${api_key}&page=${page}&language=en-US&include_adult=false`,
    {
      signal,
    }
  );
  return res.data;
};
