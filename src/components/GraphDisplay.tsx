// src/components/GraphDisplay.tsx
import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { convertToGraphData } from "../utils/algofileFolderData";
import { fileFolderDatas } from "../data/fileFolderData";

const GraphDisplay: React.FC = () => {
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
      am5hierarchy.Pack.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        initialDepth: 10,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
      })
    );

    series.circles.template.setAll({});

    series.labels.template.set("minScale", 0);

    let selectedDataItem: any;

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

    const graphData = convertToGraphData(fileFolderDatas);
    series.data.setAll(graphData);

    // Make stuff animate on load
    series.appear(1000, 100);

    return () => root.dispose();
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "700px" }}></div>;
};

export default GraphDisplay;
