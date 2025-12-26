import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollShuttleBackground from "../components/ScrollShuttleBackground";
import SolarSystemOverlay3D from "../components/SolarSystemOverlay3D";

const MainLayout = () => {
  const [openSolar, setOpenSolar] = useState(false);
  const location = useLocation();

  return (
    <div className="relative">
      {/* 3D background ONLY on home */}
      {location.pathname === "/" && <ScrollShuttleBackground />}

      <Navbar onLogoClick={() => setOpenSolar(true)} />
      <Outlet />
      <Footer />

      <SolarSystemOverlay3D
        open={openSolar}
        onClose={() => setOpenSolar(false)}
      />
    </div>
  );
};

export default MainLayout;
