// src/pages/HomePage.tsx
import React, { useState } from "react";
import { Typography } from "antd";
import CreateProject from "../components/CreateProject";
import ProjectList from "../components/ProjectList";
import Project from "../models/Project";

const { Title } = Typography;

const HomePage: React.FC = () => {
  const [newProject, setNewProject] = useState<Project>();

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>GitHub Project Analyzer</Title>
      <div style={{ marginBottom: "20px" }}>
        <CreateProject setNewProject={setNewProject} />
      </div>
      <Title level={3}>Your Projects</Title>
      <ProjectList newProjet={newProject} />
    </div>
  );
};

export default HomePage;
