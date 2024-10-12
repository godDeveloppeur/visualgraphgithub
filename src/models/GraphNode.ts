import * as am5 from "@amcharts/amcharts5";

export interface GraphNode {
  name: string;
  value?: number; // Valeur pour les fichiers
  children?: GraphNode[]; // Sous-éléments pour les dossiers
  nodeSettings: {
    fill: am5.Color; // Couleur de remplissage (de type am5.Color)
  };
}
