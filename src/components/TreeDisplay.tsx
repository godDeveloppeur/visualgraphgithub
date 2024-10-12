import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const TreeDisplay: React.FC = () => {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    let zoomableContainer = root.container.children.push(
      am5.ZoomableContainer.new(root, {
        width: am5.p100,
        height: am5.p100,
        wheelable: true,
        pinchZoom: true,
      })
    );

    let zoomTools = zoomableContainer.children.push(
      am5.ZoomTools.new(root, {
        target: zoomableContainer,
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
    let series = zoomableContainer.contents.children.push(
      am5hierarchy.Tree.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        initialDepth: 10,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
      })
    );

    series.labels.template.set("minScale", 0);

    // Generate and set data
    // https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data
    let maxLevels = 3;
    let maxNodes = 3;
    let maxValue = 100;

    let data = {
      name: "Root",
      children: [],
    };
    generateLevel(data, "", 0);

    series.data.setAll([data]);
    series.set("selectedDataItem", series.dataItems[0]);

    function generateLevel(data: any, name: any, level: any) {
      for (var i = 0; i < Math.ceil(maxNodes * Math.random()) + 1; i++) {
        let nodeName = name + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i];
        let child: any;
        if (level < maxLevels) {
          child = {
            name: nodeName + level,
          };

          if (level > 0 && Math.random() < 0.5) {
            child.value = Math.round(Math.random() * maxValue);
          } else {
            child.children = [];
            generateLevel(child, nodeName + i, level + 1);
          }
        } else {
          child = {
            name: name + i,
            value: Math.round(Math.random() * maxValue),
          };
        }
        data.children.push(child);
      }

      level++;
      return data;
    }

    // Make stuff animate on load
    series.appear(1000, 100);

    return () => root.dispose();
  }, []);
  return <div id="chartdiv" style={{ width: "100%", height: "700px" }}></div>;
};

export default TreeDisplay;
