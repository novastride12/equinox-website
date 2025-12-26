import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ScrollHome from "./pages/ScrollHome";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ScrollHome />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
