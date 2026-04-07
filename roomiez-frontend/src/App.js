import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Questionnaire from "./pages/Questionnaire";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;