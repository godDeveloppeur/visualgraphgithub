export interface FileFolderCommits {
  id: string;
  parendId: string | null;
  typeFileOrFolder: string;
  fileFolderNumber: number;
  fileFolderName: string;
  codeLines: number;
  codeHealh: number;
  codeThreshold: number;
  LineCoverage: number;
}
