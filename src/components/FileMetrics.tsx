// src/components/FileMetrics.tsx
import React from "react";
import { Card } from "antd";

interface FileMetricsProps {
  filename: string;
  metrics: {
    codeHealth: number;
    commits: number;
    lineCoverage: number;
  };
}

const FileMetrics: React.FC<FileMetricsProps> = ({ filename, metrics }) => {
  return (
    <Card title={filename}>
      <p>Code Health: {metrics.codeHealth}</p>
      <p>Commits: {metrics.commits}</p>
      <p>Line Coverage: {metrics.lineCoverage}%</p>
    </Card>
  );
};

export default FileMetrics;
