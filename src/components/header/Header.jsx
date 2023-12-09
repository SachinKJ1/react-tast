 
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useUiContext } from "../../contexts/UiContext";

function Header() {
  const navigate = useNavigate();
  // const [loggedIn, setLoggedIn] = useState();

  const { updateLoginStatus, loginStatus } = useUiContext();
  function logOut() {
    localStorage.removeItem("token");
    updateLoginStatus(false);
    navigate("/login");
  }

  /* useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) setLoggedIn(() => false);
    else setLoggedIn(() => true);
  }, []); */
  return (
    <div className="header-container">
      <nav className="header-container-nav">
        <ul className="header-heading">
          <li>User Management System</li>
        </ul>
        {loginStatus && (
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
            <li>
              <button
                onClick={() => {
                  logOut();
                }}
              >
                Sign Out
              </button>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}

export default Header;
