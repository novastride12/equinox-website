import Home from "./Home";
import Events from "./Events";
import Team from "./Team";
import Gallery from "./Gallery";
import About from "./About";

const ScrollHome = () => {
  return (
    <main className="relative z-10">
      <section id="home" className="min-h-screen">
        <Home />
      </section>

      <section id="events" className="min-h-screen">
        <Events />
      </section>

      <section id="team" className="min-h-screen">
        <Team />
      </section>

      <section id="gallery" className="min-h-screen">
        <Gallery />
      </section>

      <section id="about" className="min-h-screen">
        <About />
      </section>
    </main>
  );
};

export default ScrollHome;
