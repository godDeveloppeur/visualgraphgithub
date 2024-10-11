// src/components/CreateProject.tsx
import React, { useState } from "react";
import { Input, Button } from "antd";
import Project from "../models/Project";

const CreateProject = ({
  setNewProject,
}: {
  setNewProject: React.Dispatch<React.SetStateAction<Project | undefined>>;
}) => {
  const [repoUrl, setRepoUrl] = useState("");

  const handleCreateProject = () => {
    if (repoUrl) {
      const project: Project = {
        id: Date.now().toString(),
        repoUrl,
        name: repoUrl.split("/").pop() || "Untitled Project",
      };

      const savedProjects = JSON.parse(
        localStorage.getItem("projects") || "[]"
      );
      savedProjects.push(project);
      setNewProject(project);
      localStorage.setItem("projects", JSON.stringify(savedProjects));
      setRepoUrl("");
      alert(`Project ${project.name} created!`);
    }
  };

  return (
    <div>
      <Input
        style={{ marginBottom: "20px" }}
        placeholder="Enter GitHub repository URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <Button type="primary" onClick={handleCreateProject}>
        Create Project
      </Button>
    </div>
  );
};

export default CreateProject;
