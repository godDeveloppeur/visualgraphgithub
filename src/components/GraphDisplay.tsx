// src/components/GraphDisplay.tsx
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { convertToGraphData } from "../utils/algofileFolderData";

import { FileFolderCommits } from "../models/FileFolderCommits";
import { GraphNode } from "../models/GraphNode";
import { TypeFileOrFolder } from "../enums/TypeFileOrFolder";

const GraphDisplay = ({
  filterMetrics,
  fileFolderDatas,
}: {
  filterMetrics: {
    codeLines: number;
    codeHealh: number;
    LineCoverage: number;
    maxCodeLine: number;
  };
  fileFolderDatas: FileFolderCommits[];
}) => {
  const [filterFileFolderDatas, setFilterFileFolderDatas] =
    useState<FileFolderCommits[]>(fileFolderDatas);
  const [graphData, setGraphData] = useState<GraphNode[]>(
    convertToGraphData(fileFolderDatas)
  );

  useEffect(() => {
    setGraphData(convertToGraphData(filterFileFolderDatas));
  }, [filterFileFolderDatas]);

  useEffect(() => {
    setFilterFileFolderDatas(
      fileFolderDatas.filter((dt) => {
        if (dt.typeFileOrFolder === TypeFileOrFolder.FILE) {
          return (
            dt.codeHealh >= filterMetrics.codeHealh &&
            dt.codeLines >= filterMetrics.codeLines &&
            dt.LineCoverage > filterMetrics.LineCoverage
          );
        } else {
          return dt.codeLines >= filterMetrics.codeLines;
        }
      })
    );
  }, [filterMetrics]);

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

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
    let series = zoomableContainer.contents.children.push(
      am5hierarchy.Pack.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        initialDepth: 10,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
      })
    );
    series.circles.template.adapters.add("fill", function (fill, target) {
      if (target.dataItem?.dataContext) {
        const dataCt: any = target.dataItem?.dataContext;
        return dataCt.nodeSettings.fill;
      } else {
        return am5.color("rgb(235, 235, 235)");
      }
    });

    series.labels.template.set("minScale", 0);

    // handle clicking on nodes and link/unlink them
    series.nodes.template.events.on("click", function (e) {
      // check if we have a selected data item
      let targetDataItem = e.target.dataItem;
      if (targetDataItem) {
      }
    });

    // Gestion de la sélection pour chaque nœud
    series.nodes.template.events.on("click", (event) => {
      const node = event.target;

      // Réinitialiser les autres nœuds
      series.nodes.each((otherNode) => {
        otherNode.setAll({
          opacity: 0.3, // Épaisseur par défaut
        });
      });

      // Appliquer les changements de bordure pour le nœud sélectionné
      node.setAll({
        opacity: 1, // Épaisseur augmentée pour l'élément sélectionné
      });
    });

    series.data.setAll(graphData);

    // Make stuff animate on load
    series.appear(1000, 100);

    return () => root.dispose();
  }, [graphData]);

  return <div id="chartdiv" style={{ width: "100%", height: "700px" }}></div>;
};

export default GraphDisplay;
