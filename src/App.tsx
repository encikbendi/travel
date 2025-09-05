import { Route, Routes } from "react-router-dom";

import PackagesPage from "./pages/packages";
import ParticipantsPage from "./pages/participants";
import ScheduleParticipantsPage from "./pages/scheduleParticipants";
import TripsPage from "./pages/myTrips";

import SchedulePage from "@/pages/schedule";
import IndexPage from "@/pages/index";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />

      <Route element={<SchedulePage />} path="/schedule" />
      <Route
        element={<ScheduleParticipantsPage />}
        path="/schedules/:id/participants"
      />

      <Route element={<PackagesPage />} path="/packages" />

      <Route element={<ParticipantsPage />} path="/participants" />

      <Route element={<TripsPage />} path="/trips" />
    </Routes>
  );
}

export default App;
