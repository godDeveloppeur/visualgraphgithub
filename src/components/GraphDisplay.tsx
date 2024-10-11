// src/components/GraphDisplay.tsx
import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { graphData } from "../data/mockData";

const GraphDisplay: React.FC = () => {
  useEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
      })
    );

    let series = container.children.push(
      am5hierarchy.Pack.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        initialDepth: 10,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
      })
    );

    series.data.setAll(graphData);

    return () => root.dispose();
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "700px" }}></div>;
};

export default GraphDisplay;
