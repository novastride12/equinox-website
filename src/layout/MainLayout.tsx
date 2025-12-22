import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SolarSystemOverlay3D from "../components/SolarSystemOverlay3D";


const MainLayout = () => {
  const [showSolarSystem, setShowSolarSystem] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar onLogoClick={() => setShowSolarSystem(true)} />
      <main className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <SolarSystemOverlay3D
        open={showSolarSystem}
        onClose={() => setShowSolarSystem(false)}
      />
    </div>
  );
};

export default MainLayout;
