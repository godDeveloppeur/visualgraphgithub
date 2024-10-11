// src/components/ProjectList.tsx
import React, { useState, useEffect } from "react";
import { List, Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import Project from "../models/Project";

const ProjectList = ({ newProjet }: { newProjet: Project | undefined }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(savedProjects);
  }, []);

  useEffect(() => {
    if (newProjet) {
      const savedProjects = JSON.parse(
        localStorage.getItem("projects") || "[]"
      );
      setProjects(savedProjects);
    }
  }, [newProjet]);

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
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
