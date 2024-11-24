import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import PageNotFound from "./Pages/PageNotFound";
import UpdateApiKeys from "./Pages/UpdateApiKeys";
import Signup from "./Pages/Signup";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update-api-keys" element={<UpdateApiKeys />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
