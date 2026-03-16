import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Shell from "./components/Shell";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyCollege from "./pages/MyCollege";
import Nearby from "./pages/Nearby";
import Signup from "./pages/Signup";
import Trending from "./pages/Trending";

function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/trending" element={<Trending />} />
        <Route
          path="/nearby"
          element={
            <ProtectedRoute>
              <Nearby />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-college"
          element={
            <ProtectedRoute>
              <MyCollege />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute requireRoles={["Admin", "Organizer"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
