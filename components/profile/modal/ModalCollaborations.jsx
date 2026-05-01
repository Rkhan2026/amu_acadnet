import React from "react";
import Section from "@/components/ui/Section";
import ProjectCard from "@/components/ui/ProjectCard";
import { Handshake } from "lucide-react";

const ModalCollaborations = ({ collaborations, onProjectClick }) => {
  const hasCollabs = collaborations && collaborations.length > 0;

  return (
    <Section
      title="Collaborations"
      icon={Handshake}
      variant="blue"
      className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-10"
    >
      {hasCollabs ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {collaborations.map((c) => (
            <ProjectCard
              key={c.project.projectID}
              project={c.project}
              onClick={() => onProjectClick(c.project.projectID)}
              variant="compact"
            />
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400">
          <Handshake className="h-10 w-10 mb-3 opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            No Active Collaborations
          </p>
        </div>
      )}
    </Section>
  );
};

export default ModalCollaborations;
