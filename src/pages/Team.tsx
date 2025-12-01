import SectionHeader from "../components/SectionHeader";
import TeamCard from "../components/TeamCard";
import type  { TeamMember } from "../components/TeamCard";
import team from "../data/team.json";

const Team = () => {
  const members = team as TeamMember[];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <SectionHeader
        title="Team"
        subtitle="Student-led, guided by faculty mentors and alumni."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((m) => (
          <TeamCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
};

export default Team;
