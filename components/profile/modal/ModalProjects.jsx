import React from "react";
import Section from "@/components/ui/Section";
import ProjectCard from "@/components/ui/ProjectCard";
import { BookOpen } from "lucide-react";

const ModalProjects = ({ projects, onProjectClick }) => {
  const hasProjects = projects && projects.length > 0;

  return (
    <Section
      title="Projects"
      icon={BookOpen}
      variant="green"
      className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-10"
    >
      {hasProjects ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {projects.map((p) => (
            <ProjectCard
              key={p.projectID}
              project={p}
              onClick={() => onProjectClick(p.projectID)}
              variant="compact"
            />
          ))}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-[2rem]">
          <p className="text-[11px] font-black uppercase tracking-[0.3em]">
            Empty
          </p>
        </div>
      )}
    </Section>
  );
};

export default ModalProjects;
