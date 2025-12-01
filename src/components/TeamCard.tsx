export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  tags?: string[];
}

interface TeamCardProps {
  member: TeamMember;
}

const TeamCard = ({ member }: TeamCardProps) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col items-center text-center gap-3">
      <img
        src={member.photo}
        alt={member.name}
        className="h-20 w-20 rounded-full object-cover border border-slate-700"
      />
      <div>
        <div className="font-semibold text-slate-100">{member.name}</div>
        <div className="text-xs text-cyan-300 uppercase tracking-wide">
          {member.role}
        </div>
      </div>
      <p className="text-xs text-slate-400">{member.bio}</p>
      {member.tags && (
        <div className="flex flex-wrap gap-1 justify-center">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamCard;
