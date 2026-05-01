import React from "react";
import ProjectHeader from "./ProjectHeader";
import ProjectDescription from "./ProjectDescription";
import RequirementList from "./RequirementList";
import ExternalLinks from "./ExternalLinks";

const ProjectDetailMain = ({
  project,
  isEditing,
  editForm,
  setEditForm,
  isOwner,
  addRequirement,
  removeRequirement,
  newRequirement,
  setNewRequirement,
  addExternalLink,
  removeExternalLink,
  updateExternalLink,
  onProfileClick,
}) => {
  return (
    <div className="lg:col-span-2 space-y-10">
      <ProjectHeader
        project={project}
        isEditing={isEditing}
        editForm={editForm}
        setEditForm={setEditForm}
        isOwner={isOwner}
        onProfileClick={onProfileClick}
      />

      <ProjectDescription
        isEditing={isEditing}
        description={isEditing ? editForm.description : project.description}
        onChange={(val) => setEditForm({ ...editForm, description: val })}
      />

      <RequirementList
        isEditing={isEditing}
        requirements={isEditing ? editForm.requirements : project.requirements}
        onAdd={addRequirement}
        onRemove={removeRequirement}
        inputValue={newRequirement}
        onInputChange={setNewRequirement}
      />

      <ExternalLinks
        isEditing={isEditing}
        links={isEditing ? editForm.externalLinks : project.externalLinks}
        onAdd={addExternalLink}
        onRemove={removeExternalLink}
        onChange={updateExternalLink}
      />
    </div>
  );
};

export default ProjectDetailMain;
