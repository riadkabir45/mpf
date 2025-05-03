import { EthProvider } from "./contexts/EthContext";
import { Routes, Route } from "react-router-dom";
import UserManager from "./pages/UserManager";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Nav from "./pages/Nav";
import UserProfile from "./pages/userProfile";
import Logout from "./pages/Logout";
import DefautHandler from "./pages/DefaultHandler";

function App() {
  return (
    <EthProvider>
      <Nav />
      <Routes>
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="userManager" element={<UserManager />} />
        <Route path="userProfile" element={<UserProfile />} />
        <Route path="logout" element={<Logout />} />
        <Route path="" element={<DefautHandler />} />
      </Routes>
    </EthProvider>
  );
}

export default App;
