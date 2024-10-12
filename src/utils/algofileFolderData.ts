import { TypeFileOrFolder } from "../enums/TypeFileOrFolder";
import { FileFolderCommits } from "../models/FileFolderCommits";
import * as am5 from "@amcharts/amcharts5";
import { GraphNode } from "../models/GraphNode";

// Fonction pour déterminer la couleur du nœud
function determineNodeColor(
  type: string,
  codeHealth: number,
  depth: number
): am5.Color {
  // Couleurs pour les fichiers en fonction du codeHealth
  const colorRanges = [
    { threshold: 25, color: 0xe45b3f }, // Rouge grisé
    { threshold: 50, color: 0xf4ca3b }, // Jaune orange
    { threshold: 75, color: 0xe2e43f }, // Jaune vert
    { threshold: 100, color: 0x64f07d }, // Vert pale
  ];

  // Choix de couleur pour les fichiers
  if (type === TypeFileOrFolder.FILE) {
    const colorRange = colorRanges.find(
      (range) => codeHealth <= range.threshold
    );
    return am5.color(colorRange?.color || 0x64f07d); // Valeur par défaut: vert pale
  }

  // Choix de couleur pour les dossiers en fonction de la profondeur
  const baseGray = 235;
  const grayValue = Math.max(0, baseGray - depth * 10); // Réduction de 10 pour chaque niveau de profondeur
  return am5.color(`rgb(${grayValue}, ${grayValue}, ${grayValue})`);
}

export const convertToGraphData = (
  fileFolderDatas: FileFolderCommits[]
): GraphNode[] => {
  // Dictionnaire pour stocker chaque item par son ID pour un accès rapide
  const nodeMap: {
    [id: string]: GraphNode & { id: string; parentId: string | null };
  } = {};

  // Convertir chaque item de fileFolderDatas en GraphNode et les stocker dans nodeMap
  fileFolderDatas.forEach((item: FileFolderCommits) => {
    nodeMap[item.id] = {
      id: item.id,
      parentId: item.parendId,
      name: item.fileFolderName,
      ...(item.typeFileOrFolder === TypeFileOrFolder.FILE
        ? { value: item.codeLines } // Ajouter la valeur pour les fichiers
        : { children: [] }), // Ajouter les enfants pour les dossiers
      nodeSettings: {
        fill: determineNodeColor(item.typeFileOrFolder, item.codeHealh, 0), // Couleur de base, profondeur 0
      },
    };
  });

  // Créer le dossier racine "src"
  const rootNode: GraphNode = {
    name: "src",
    children: [],
    nodeSettings: { fill: am5.color("rgb(235, 235, 235)") },
  };

  // Fonction récursive pour attacher les enfants au bon niveau dans l'arborescence
  const buildHierarchy = (
    parentId: string | null,
    depth: number = 0
  ): GraphNode[] => {
    return fileFolderDatas
      .filter((item) => item.parendId === parentId)
      .map((item) => {
        const node = nodeMap[item.id];
        if (node.children) {
          // Si c'est un dossier, on construit récursivement ses enfants et ajuste la profondeur
          node.children = buildHierarchy(node.id, depth + 1);
          node.nodeSettings.fill = determineNodeColor(
            TypeFileOrFolder.FOLDER,
            0,
            depth + 1
          );
        }
        return node;
      });
  };

  // Attacher tous les éléments sans parentId sous le dossier "src"
  rootNode.children = buildHierarchy(null);

  return [rootNode]; // Retourner le noeud "src" en tant que racine unique
};
