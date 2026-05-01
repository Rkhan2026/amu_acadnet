import React from "react";
import Section from "@/components/ui/Section";
import { User } from "lucide-react";

const ModalBiography = ({ biography }) => {
  return (
    <Section
      title="Academic Biography"
      icon={User}
      variant="green"
      className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-8"
    >
      <p className="text-gray-800 leading-relaxed font-bold text-xl">
        {biography ||
          "No biography provided yet. This researcher is dedicated to their field of study at Aligarh Muslim University."}
      </p>
    </Section>
  );
};

export default ModalBiography;
