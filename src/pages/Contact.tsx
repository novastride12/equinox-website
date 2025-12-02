import SectionHeader from "../components/SectionHeader";

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader
        title="Join / Contact"
        subtitle="Reach out to join, collaborate or invite us."
      />
      <div className="space-y-4 text-sm text-slate-300">
        <p>
          To join the club, fill out the membership form below. We typically
          onboard new members at the beginning of each semester.
        </p>

        <a
          href="https://forms.gle/your-membership-form"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400 text-slate-950 text-sm font-medium hover:bg-cyan-300 transition"
        >
          Membership Form ↗
        </a>

        <div className="mt-6 space-y-2 text-xs text-slate-400">
          <p>
            <span className="font-semibold text-slate-200">Email:</span>{" "}
            equinox.club@yourcollege.edu
          </p>
          <p>
            <span className="font-semibold text-slate-200">Instagram:</span>{" "}
            @equinox.pesecc
          </p>
          <p>
            <span className="font-semibold text-slate-200">Location:</span>{" "}
            PES University, EC Campus
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
