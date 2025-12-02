import SectionHeader from "../components/SectionHeader";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader
        title="About the Club"
        subtitle="Who we are and what we do."
      />
      <div className="space-y-4 text-sm text-slate-300">
        <p>
          Equinox is the space technology club of PES university. We bring
          together students interested in rocketry, space systems, astronomy and
          engineering to learn by building and doing.
        </p>
        <p>
          Our activities include technical talks, hands-on software workshops,
          model rocket design and testing, night-sky observation sessions and
          long-term projects.
        </p>
        <p>
          The club is open to students from any branch. No prior experience is
          required—just curiosity about space.
        </p>
      </div>
    </div>
  );
};

export default About;
