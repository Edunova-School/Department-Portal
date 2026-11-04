
import { Routes, Route } from "react-router-dom";

import DepartmentLayout from "./layouts/DepartmentLayout";

// Pages
import Dashboard from "./pages/dashboard";
import Students from "./pages/Students";
import Staff from "./pages/Staff";
import Courses from "./pages/course";
import Results from "./pages/result";
import Attendance from "./pages/Attendance";
import Requests from "./pages/Requests";
import Login from "./pages/login";

// Route protection
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DepartmentLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/results" element={<Results />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/requests" element={<Requests />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
