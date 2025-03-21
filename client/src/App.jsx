import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Error from "./components/Error";
import EmailVerify from "./components/EmailVerify";

function App() {
  const user = localStorage.getItem("token"); // Token ko check karo

  return (
    <>
    <Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/user/:id/verify/:token" element={<EmailVerify />} />
		</Routes>
    </>
  );
}

export default App;
