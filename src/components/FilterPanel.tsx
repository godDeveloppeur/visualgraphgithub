// src/components/FilterPanel.tsx
import React from "react";
import { Input, Select, Slider } from "antd";

const { Option } = Select;

const FilterPanel: React.FC = () => {
  return (
    <div>
      <Input placeholder="Search by filename" />
      <Select
        placeholder="Filter by owner"
        style={{ width: "100%", marginTop: "10px" }}
      >
        <Option value="dev1">Developer 1</Option>
        <Option value="dev2">Developer 2</Option>
      </Select>
      <div style={{ marginTop: "20px" }}>
        <label>Code Health Range</label>
        <Slider min={0} max={10} defaultValue={5} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Commit Threshold</label>
        <Slider min={0} max={100} defaultValue={50} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Line Coverage</label>
        <Slider min={0} max={100} defaultValue={75} />
      </div>
    </div>
  );
};

export default FilterPanel;
