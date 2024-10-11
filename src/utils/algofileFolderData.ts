import { TypeFileOrFolder } from "../enums/TypeFileOrFolder";
import { FileFolderCommits } from "../models/FileFolderCommits";

interface GraphNode {
  name: string;
  value?: number; // Uniquement pour les fichiers
  children?: GraphNode[]; // Pour les dossiers
}

export const convertToGraphData = (
  fileFolderDatas: FileFolderCommits[]
): GraphNode[] => {
  // Dictionnaire pour stocker chaque item par son ID pour un accès rapide
  const nodeMap: {
    [id: string]: GraphNode & { id: string; parentId: string | null };
  } = {};

  // Convertir chaque item de fileFolderDatas en GraphNode et les stocker dans nodeMap
  fileFolderDatas.forEach((item) => {
    nodeMap[item.id] = {
      id: item.id,
      parentId: item.parendId,
      name: item.fileFolderName,
      ...(item.typeFileOrFolder === TypeFileOrFolder.FILE
        ? { value: item.codeLines } // Ajouter la valeur pour les fichiers
        : { children: [] }), // Ajouter les enfants pour les dossiers
    };
  });

  // Créer le dossier racine "src"
  const rootNode: GraphNode = { name: "src", children: [] };

  // Fonction récursive pour attacher les enfants au bon niveau dans l'arborescence
  const buildHierarchy = (parentId: string | null): GraphNode[] => {
    return fileFolderDatas
      .filter((item) => item.parendId === parentId)
      .map((item) => {
        const node = nodeMap[item.id];
        if (node.children) {
          // Si c'est un dossier, on construit récursivement ses enfants
          node.children = buildHierarchy(node.id);
        }
        return node;
      });
  };

  // Attacher tous les éléments sans parentId sous le dossier "src"
  rootNode.children = buildHierarchy(null);

  return [rootNode]; // Retourner le noeud "src" en tant que racine unique
};
