// src/components/GraphDisplay.tsx
import React, { useEffect, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { convertToGraphData } from "../utils/algofileFolderData";
import {
  smallFileFolderDatas,
  mediumFileFolderDatas,
  bigFileFolderDatas,
} from "../data/fileFolderData";
import { GraphNode } from "../models/GraphNode";
import { FileFolderCommits } from "../models/FileFolderCommits";

const GraphDisplay: React.FC = () => {
  const randomFileFolderData = (): FileFolderCommits[] => {
    const options = [
      smallFileFolderDatas,
      mediumFileFolderDatas,
      bigFileFolderDatas,
    ];
    const randomIndex = Math.floor(Math.random() * options.length);
    console.log(randomIndex);
    return options[randomIndex];
  };

  const graphData = convertToGraphData(mediumFileFolderDatas);
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    //let chart = root.container.children.push(am5xy.XYChart.new(root, {}));

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
