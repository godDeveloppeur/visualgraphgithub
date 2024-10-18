// for Bubble diagrams for file and folder

export interface FileFolderModified {
  id: string;
  name: String;
  level: number;
  filepath: string;
  parentFileFolderName: string | null;
  parentFileFolderId: string | null;
  typeFileOrFolder: string;
  nbCodeLines: number;
  nbAddCodeLines: number;
  nbDeleteCodeLines: number;
  nbCodeLinesModified: number;
  modifiedRateAddOrDelCodeLines: number;
}

const ListFileFolderModified: FileFolderModified[] = [];

// Change scope on the repo
export enum ModifiedCategory {
  CONFIGURATION = "Configuration",
  TEST = "Test",
  DOCUMENTATION = "Documentation",
  DEPLOYMENT = "Deployment",
  PRODUCTION = "Production",
  DEVELOPMENT = "Development",
}

export interface commit {
  id: string;
  nbCodeLinesModified: number;
  nbModifiedFiles: number;
  date: Date;
  typeOfFiles: ModifiedCategory;
}

// Number of commits per developer
export interface commitsCategory {
  typeCommit: ModifiedCategory;
  nbCommits: number;
}

export interface author {
  id: string;
  name: string;
  nbCommits: number;
  ListCommitsCategory: ModifiedCategory[];
}
