import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import SignUp from "./components/signUp/SignUp";
import AdminHome from "./components/AdminHome/AdminHome";
import CreateUser from "./components/CreateUser/CreateUser";
import UpdateUser from "./components/UpdateUser/UpdateUser";
import Spinner from "./components/Spinner/Spinner";
import Notification from "./components/Notification/Notification";
import { useState } from "react";
import { useUiContext } from "./contexts/UiContext";

function App() {
  // const [notify, setNotify] = useState(false);
  const { notify, notifyMsg, notifyColor, spinning } = useUiContext();
 
  return (
    <div>
      <Header />
      {/* Routes */}
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="update-user/:id" element={<UpdateUser />} />
      </Routes>

      <Footer />
      {/* Spinner */}
      {spinning && (
        <div className="loading-spinner">
          <Spinner />
        </div>
      )}
      {/* Notification container */}
      {notify && (
        <div className={`${notifyColor} notification`}>
          <Notification> {notifyMsg} </Notification>
        </div>
      )}
    </div>
  );
}

export default App;
