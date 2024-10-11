// src/pages/ProjectPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Row, Col } from "antd";
import GraphDisplay from "../components/GraphDisplay";
import FilterPanel from "../components/FilterPanel";
import FileMetrics from "../components/FileMetrics";
import { mockFiles } from "../data/mockData";
import TreeDisplay from "../components/TreeDisplay";

const { Title } = Typography;

interface Project {
  id: string;
  repoUrl: string;
  name: string;
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const foundProject = savedProjects.find((p: Project) => p.id === projectId);
    setProject(foundProject);
  }, [projectId]);

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
  };

  const selectedMetrics = selectedFile
    ? mockFiles.find((file) => file.filename === selectedFile)
    : null;

  return (
    <div style={{ padding: "20px" }} className="container_style1">
      {project ? (
        <>
          <div>
            <Title level={2}>{project.name} Analysis</Title>
            <div className="center_container">
              <Row gutter={16}>
                <Col span={16}>
                  <GraphDisplay />
                </Col>
                <Col span={8}>
                  <FilterPanel />
                </Col>
              </Row>
              {selectedMetrics && (
                <div style={{ marginTop: "20px" }}>
                  <FileMetrics
                    filename={selectedMetrics.filename}
                    metrics={selectedMetrics}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <Title level={4}>Project not found</Title>
      )}
    </div>
  );
};

export default ProjectPage;
