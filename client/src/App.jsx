import { EthProvider } from "./contexts/EthContext";
import { Routes, Route } from "react-router-dom";
import UserManager from "./pages/UserManager";
import SignUp from "./pages/SignUp";
import Nav from "./pages/Nav";

function App() {
  return (
    <EthProvider>
      <Nav />
      <Routes>
        <Route path="signup" element={<SignUp />} />
        <Route path="" element={<UserManager />} />
      </Routes>
    </EthProvider>
  );
}

export default App;
