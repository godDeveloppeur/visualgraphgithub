// src/pages/ProjectPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Row, Col } from "antd";
import GraphDisplay from "../components/GraphDisplay";
import FilterPanel from "../components/FilterPanel";
import FileMetrics from "../components/FileMetrics";
import { mockFiles, mockProjets } from "../data/mockData";
import {
  smallFileFolderDatas,
  mediumFileFolderDatas,
  bigFileFolderDatas,
} from "../data/fileFolderData";
import { FileFolderCommits } from "../models/FileFolderCommits";
import Project from "../models/Project";

const { Title } = Typography;

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileFolderDatas, setFileFolderDatas] = useState<FileFolderCommits[]>(
    []
  );
  const [filterMetrics, setFilterMetrics] = useState<{
    codeLines: number;
    codeHealh: number;
    LineCoverage: number;
    maxCodeLine: number;
  }>({
    codeLines: 0,
    codeHealh: 0,
    LineCoverage: 0,
    maxCodeLine: 1000,
  });

  useEffect(() => {
    const options = [
      smallFileFolderDatas,
      mediumFileFolderDatas,
      bigFileFolderDatas,
    ];
    let savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    savedProjects = [...mockProjets, ...savedProjects];
    const foundProject = savedProjects.find((p: Project) => p.id === projectId);
    setFileFolderDatas(options[foundProject.type]);
    setFilterMetrics({
      ...filterMetrics,
      maxCodeLine: options[foundProject.type][0].codeLines,
    });
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
                  <GraphDisplay
                    filterMetrics={filterMetrics}
                    fileFolderDatas={fileFolderDatas}
                  />
                </Col>
                <Col span={8}>
                  <FilterPanel
                    filterMetrics={filterMetrics}
                    setFilterMetrics={setFilterMetrics}
                  />
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
