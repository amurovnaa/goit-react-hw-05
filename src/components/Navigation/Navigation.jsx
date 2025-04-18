import { NavLink } from "react-router-dom";
import s from "./Navigation.module.css";

const Navigation = () => {
  const linkIsActive = ({ isActive }) => (isActive ? s.active : s.link);
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" className={linkIsActive}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/movies" className={linkIsActive}>
            Movies
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
