import { Route, Routes } from "react-router-dom";

import PackagesPage from "./pages/packages";

import SchedulePage from "@/pages/schedule";
import IndexPage from "@/pages/index";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<SchedulePage />} path="/schedule" />
      <Route element={<PackagesPage />} path="/packages" />
    </Routes>
  );
}

export default App;
