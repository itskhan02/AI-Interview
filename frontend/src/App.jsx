import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import api from "./utils/api";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import InterviewHistory from "./pages/InterviewHistory";
import Pricing from "./pages/Pricing";
import InterviewReport from "./pages/InterviewReport";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await api.get("/user/get-user");

        dispatch(setUserData(res.data.user));
      } catch {
        localStorage.removeItem("token");

        dispatch(setUserData(null));
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/sign-in" element={<Auth />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pricing"
        element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report/:id"
        element={
          <ProtectedRoute>
            <InterviewReport />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
