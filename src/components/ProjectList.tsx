// src/components/ProjectList.tsx
import React, { useState, useEffect } from "react";
import { List, Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import Project from "../models/Project";
import { mockProjets } from "../data/mockData";

const ProjectList = ({ newProjet }: { newProjet: Project | undefined }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    savedProjects = [...mockProjets, ...savedProjects];
    setProjects(savedProjects);
  }, []);

  useEffect(() => {
    if (newProjet) {
      let savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      savedProjects = [...mockProjets, ...savedProjects];
      setProjects(savedProjects);
    }
  }, [newProjet]);

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );
    setProjects(updatedProjects.filter((pj) => !mockProjets.includes(pj)));
    localStorage.setItem(
      "projects",
      JSON.stringify(updatedProjects.filter((pj) => !mockProjets.includes(pj)))
    );
    message.success("Project deleted successfully");
  };

  const openProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <List
      dataSource={projects}
      renderItem={(project) => (
        <List.Item>
          <div>{project.name}</div>
          <div>
            <Button
              onClick={() => openProject(project.id)}
              style={{ marginRight: "8px" }}
            >
              Open Project
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this project?"
              onConfirm={() => deleteProject(project.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </div>
        </List.Item>
      )}
    />
  );
};

export default ProjectList;
