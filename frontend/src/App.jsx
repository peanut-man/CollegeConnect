import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Shell from "./components/Shell";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventDetail from "./pages/EventDetail";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyCollege from "./pages/MyCollege";
import Nearby from "./pages/Nearby";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Trending from "./pages/Trending";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageColleges from "./pages/admin/ManageColleges";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageUsers from "./pages/admin/ManageUsers";

function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route
          path="/events/:eventId/edit"
          element={
            <ProtectedRoute requireRoles={["Admin", "Organizer"]}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/colleges"
          element={
            <ProtectedRoute requireRoles={["Admin"]}>
              <ManageColleges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute requireRoles={["Admin"]}>
              <ManageEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireRoles={["Admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
