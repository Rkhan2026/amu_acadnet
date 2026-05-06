import React from "react";
import { BookOpen, ListChecks, ExternalLink } from "lucide-react";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";

const ModalProjectContent = ({ project }) => {
  return (
    <div className="space-y-10">
      {/* Description */}
      <Section title="Description" icon={BookOpen}>
        <p className="text-gray-600 font-medium leading-relaxed prose prose-lg max-w-none">
          {project.description || "No description provided."}
        </p>
      </Section>

      {/* Technical Requirements */}
      {project.requirements && project.requirements.length > 0 && (
        <Section title="Requirements" icon={ListChecks}>
          <div className="flex flex-wrap gap-3">
            {project.requirements.map((req, i) => (
              <Badge
                key={i}
                className="px-5 py-2.5 text-sm font-bold lowercase cursor-default"
              >
                {req}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {/* External Links */}
      <Section title="External Links" icon={ExternalLink} variant="gray">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.externalLinks && project.externalLinks.length > 0 ? (
            project.externalLinks.map((link, i) => (
              <a
                key={i}
                href={typeof link === "string" ? link : link.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-center group hover:border-amu-green transition-all shadow-sm overflow-hidden"
              >
                <p className="text-gray-500 group-hover:text-amu-green transition-colors truncate text-sm font-medium">
                  {typeof link === "string" ? link : link.url}
                </p>
              </a>
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-white/50 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-sm text-gray-400 font-bold italic">
                No external links provided for this project.
              </p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default ModalProjectContent;
