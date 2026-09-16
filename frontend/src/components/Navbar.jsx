import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link className={location.pathname === "/" ? "active" : ""} to="/">
        🏠
        <span>Home</span>
      </Link>

      <Link className={location.pathname === "/lessons" ? "active" : ""} to="/lessons">
        📚
        <span>Lessons</span>
      </Link>

      <Link className={location.pathname === "/practice" ? "active" : ""} to="/practice">
        🎮
        <span>Practice</span>
      </Link>

      <Link className={location.pathname === "/closet" ? "active" : ""} to="/closet">
        🎒
        <span>Closet</span>
      </Link>

      <Link className={location.pathname === "/profile" ? "active" : ""} to="/profile">
        👤
        <span>Profile</span>
      </Link>
    </nav>
  );
}

export default Navbar;