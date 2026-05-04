import { Routes, Route } from "react-router-dom";

import Home from "../Pages/Home/Home";
import GradeView from "../Pages/GradeView/GradeView";
import Datas from "../Pages/Datas/Datas";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/grade/:id" element={<GradeView />} />
      <Route path="/datas" element={<Datas />} />
      <Route path="/new-grade/:id" element={<GradeView />} />
    </Routes>
  );
}

export default AppRoutes