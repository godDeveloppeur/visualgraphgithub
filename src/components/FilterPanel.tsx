// src/components/FilterPanel.tsx
import React, { useEffect, useState } from "react";
import { ConfigProvider, Input, Select, Slider } from "antd";

const colorRanges = [
  { threshold: 25, color: "#e45b3f" }, // Rouge grisé
  { threshold: 50, color: "#f4ca3b" }, // Jaune orange
  { threshold: 75, color: "#e2e43f" }, // Jaune vert
  { threshold: 100, color: "#64f07d" }, // Vert pale
];

// Fonction pour obtenir la couleur basée sur la valeur
function getSliderColor(value: number): string {
  const range = colorRanges.find((range) => value <= range.threshold);
  return range ? range.color : "#64f07d"; // Vert pale par défaut
}

const FilterPanel = ({
  filterMetrics,
  setFilterMetrics,
}: {
  filterMetrics: {
    codeLines: number;
    codeHealh: number;
    LineCoverage: number;
    maxCodeLine: number;
  };
  setFilterMetrics: React.Dispatch<
    React.SetStateAction<{
      codeLines: number;
      codeHealh: number;
      LineCoverage: number;
      maxCodeLine: number;
    }>
  >;
}) => {
  const [filterPanelMetrics, setFilterPanelMetrics] = useState<{
    codeLines: number;
    codeHealh: number;
    LineCoverage: number;
  }>({ ...filterMetrics });

  const [codeHealthColor, setCodeHealthColor] = useState<string>(
    getSliderColor(filterPanelMetrics.codeHealh)
  );

  const [lineCoverageColor, setLineCoverageColor] = useState<string>(
    getSliderColor(filterPanelMetrics.LineCoverage)
  );

  useEffect(() => {
    setFilterPanelMetrics({ ...filterMetrics });
    setCodeHealthColor(getSliderColor(filterMetrics.codeHealh));
    setLineCoverageColor(getSliderColor(filterMetrics.LineCoverage));
  }, [filterMetrics]);

  return (
    <div>
      <h2>Files or folder that have at least</h2>
      <ConfigProvider
        theme={{
          components: {
            Slider: {
              trackBg: codeHealthColor,
              trackHoverBg: codeHealthColor,
              handleColor: codeHealthColor,
              handleActiveColor: codeHealthColor,
              handleActiveOutlineColor: codeHealthColor,
              dotActiveBorderColor: codeHealthColor,
              colorPrimaryBorderHover: codeHealthColor,
            },
          },
        }}
      >
        <div style={{ marginTop: "20px" }}>
          <label>Code Health Range</label>
          <Slider
            min={0}
            max={100}
            defaultValue={0}
            value={filterPanelMetrics.codeHealh}
            onChange={(value) => {
              setFilterPanelMetrics({
                ...filterPanelMetrics,
                codeHealh: value,
              });
              setCodeHealthColor(getSliderColor(value));
            }}
            onChangeComplete={(value) => {
              setFilterMetrics({ ...filterMetrics, codeHealh: value });
            }}
          />
        </div>
      </ConfigProvider>

      <div style={{ marginTop: "20px" }}>
        <label>Number of codes lines</label>
        <Slider
          min={0}
          max={filterMetrics.maxCodeLine}
          defaultValue={0}
          value={filterPanelMetrics.codeLines}
          onChange={(value) => {
            setFilterPanelMetrics({ ...filterPanelMetrics, codeLines: value });
          }}
          onChangeComplete={(value) => {
            setFilterMetrics({ ...filterMetrics, codeLines: value });
          }}
        />
      </div>
      <ConfigProvider
        theme={{
          components: {
            Slider: {
              trackBg: lineCoverageColor,
              trackHoverBg: lineCoverageColor,
              handleColor: lineCoverageColor,
              handleActiveColor: lineCoverageColor,
              handleActiveOutlineColor: lineCoverageColor,
              dotActiveBorderColor: lineCoverageColor,
              colorPrimaryBorderHover: lineCoverageColor,
            },
          },
        }}
      >
        <div style={{ marginTop: "20px" }}>
          <label>Line Coverage</label>
          <Slider
            min={0}
            max={100}
            defaultValue={0}
            value={filterPanelMetrics.LineCoverage}
            onChange={(value) => {
              setFilterPanelMetrics({
                ...filterPanelMetrics,
                LineCoverage: value,
              });
              setLineCoverageColor(getSliderColor(value));
            }}
            onChangeComplete={(value) => {
              setFilterMetrics({ ...filterMetrics, LineCoverage: value });
            }}
          />
        </div>
      </ConfigProvider>
    </div>
  );
};

export default FilterPanel;
