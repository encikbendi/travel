import { Route, Routes } from "react-router-dom";

import PackagesPage from "./pages/packages";
import ParticipantsPage from "./pages/participants";

import SchedulePage from "@/pages/schedule";
import IndexPage from "@/pages/index";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<SchedulePage />} path="/schedule" />
      <Route element={<PackagesPage />} path="/packages" />
      <Route element={<ParticipantsPage />} path="/participants" />
    </Routes>
  );
}

export default App;
