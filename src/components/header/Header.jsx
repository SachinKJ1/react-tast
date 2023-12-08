import "./Header.css";
import { Link } from "react-router-dom";
function Header() {
  return (
    <div className="header-container">
      <nav className="header-container-nav">
        <ul className="header-heading">
          <li>User Management System</li>
        </ul>
        <ul className="header-ul">
          <li>
            <Link className="nav-links" to="/home">
              Home
            </Link>
          </li>
          <li>
            <Link className="nav-links" to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link className="nav-links" to="/sign-up">
              SignUp
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
