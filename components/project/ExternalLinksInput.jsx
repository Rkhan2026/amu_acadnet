import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ExternalLinksInput = ({ links, setLinks }) => {
  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const removeLink = (index) => {
    if (links.length === 1) {
      handleLinkChange(0, "");
      return;
    }
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pt-4 border-t border-gray-50">
      <div className="mb-2 ml-1">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
          External Links
        </label>
      </div>

      {links.map((link, index) => (
        <div key={index} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              required
              value={link}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              placeholder="Publication URL, Repo, or Citation link"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amu-green/20 focus:border-amu-green transition-all font-bold text-gray-900 placeholder:text-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addLink}
              className="p-4 bg-amu-green/10 text-amu-green rounded-2xl hover:bg-amu-green/20 transition-all"
              title="Add Link"
            >
              <Plus className="h-5 w-5" />
            </button>
            {index > 0 ? (
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 hover:text-red-500 transition-all"
                title="Remove Link"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            ) : (
              <div className="w-13" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExternalLinksInput;
