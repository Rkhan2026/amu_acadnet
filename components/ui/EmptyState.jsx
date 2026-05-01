import React from "react";

const EmptyState = ({ icon: Icon, title, description, color = "gray" }) => {
  const colorMap = {
    gray: "bg-gray-50 text-gray-300",
    green: "bg-amu-green/10 text-amu-green",
    red: "bg-red-50 text-red-500",
    amber: "bg-amber-50 text-amber-500",
  };

  const selectedColor = colorMap[color] || colorMap.gray;

  return (
    <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
      <div className={`p-6 rounded-3xl mb-6 ${selectedColor}`}>
        <Icon size={48} />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 font-medium">{description}</p>
    </div>
  );
};

export default EmptyState;
