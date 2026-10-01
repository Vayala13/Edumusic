import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

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

      <button onClick={handleLogout} className="nav-logout">
        🚪
        <span>Log Out</span>
      </button>
    </nav>
  );
}

export default Navbar;
