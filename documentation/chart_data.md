
# Bubble Diagram and motion-chart for Files and Folders

This project aims to visualize file and folder modifications using bubble diagrams and motion-chart. The visualization provides insights into the number of lines added, deleted, or modified for each file and folder in a given commit range.

## Table of Contents
- [Bubble Diagram and motion-chart for Files and Folders](#bubble-diagram-and-motion-chart-for-files-and-folders)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Key Interfaces and Enums](#key-interfaces-and-enums)
    - [FileFolderModified](#filefoldermodified)
    - [Commit](#commit)
    - [ModifiedCategory](#modifiedcategory)
    - [Author](#author)
    - [CommitsCategory](#commitscategory)
  - [File and Folder Creation Process](#file-and-folder-creation-process)
  - [Folder Structure Creation](#folder-structure-creation)
    - [Why Do We Need `parentFileFolderId` When We Already Have `parentFileFolderName`?](#why-do-we-need-parentfilefolderid-when-we-already-have-parentfilefoldername)
    - [Summing Code Changes in Folders](#summing-code-changes-in-folders)
  - [Modification Metrics](#modification-metrics)
      - [Example 1:](#example-1)
      - [Example 2:](#example-2)
  - [Change Scope in the Repository](#change-scope-in-the-repository)
  - [Commit Statistics by Author](#commit-statistics-by-author)

## Project Overview

This project enables tracking of modified files and folders within a repository. By analyzing the commit history between a start and end date, the system can generate bubble diagrams that visualize the impact of these changes.

## Key Interfaces and Enums

### FileFolderModified
This interface defines the structure of the modified files and folders:
```typescript
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
```

### Commit
This interface represents a commit, which tracks changes made in the repository:
```typescript
export interface commit {
  id: string;
  nbCodeLinesModified: number;
  nbModifiedFiles: number;
  date: Date;
  typeOfFiles: ModifiedCategory;
}
```

### ModifiedCategory
An enum defining different categories of file modifications:
```typescript
export enum ModifiedCategory {
  CONFIGURATION = "Configuration",
  TEST = "Test",
  DOCUMENTATION = "Documentation",
  DEPLOYMENT = "Deployment",
  PRODUCTION = "Production",
  DEVELOPMENT = "Development",
}
```

### Author
This interface tracks the author and their associated commits:
```typescript
export interface author {
  id: string;
  name: string;
  nbCommits: number;
  ListCommitsCategory: ModifiedCategory[];
}
```

### CommitsCategory
Tracks the number of commits per category:
```typescript
export interface commitsCategory {
  typeCommit: ModifiedCategory;
  nbCommits: number;
}
```

## File and Folder Creation Process

- You can iterate through the commits between the start and end dates.
- For each commit, retrieve the modified files. If a file is not already in the `ListFileFolderModified`, add it as a `FileFolderModified` object, extracting the necessary information.
- If the file has already been modified in a previous commit, update the existing object, primarily changing `nbCodeLinesModified` and `modifiedRateAddOrDelCodeLines`.

When creating a file, don't forget to set its level. For example, for the file path `activerecord/test/support/async_helper.rb`, the level is 3 (as there are three `/`). You should also add the name of the parent folder to `parentFileFolderName`. For top-level folders, such as `activerecord`, set `parentFileFolderName` to `main`.

## Folder Structure Creation

- Begin by creating a file named `main` or `master` with level 0. In `FileFolderModified`, this would be represented as `Level = 0`.
- After generating the list of modified files, iterate through the list. For each file, retrieve its file path, split it by level, and create a folder for each level. For example, in the path `activerecord/test/support/async_helper.rb`, the folder `activerecord` would be level 1, `test` would be level 2, and so on. Skip the creation if the folder already exists.
- Once the folders are created, add all files and folders to their parent folders (e.g., a level 1 file or folder goes into a level 0 folder). This process should iterate through all levels, starting from 0 to 1000. The loop should terminate when no files or folders exist at the current level (for example, after 6 iterations if no level 6 folders are found).

In the loop, you retrieve the folders at the index level with a filter and in another list, you retrieve the files and folders having
the index level + 1. The goal is to add in the files or folders of the index + 1 the `parentFileFolderId` of the folder of the index level, checking that 
this folder is the correct one (with parentFileFolderName).

### Why Do We Need `parentFileFolderId` When We Already Have `parentFileFolderName`?
Since it's possible to have multiple folders with the same name (e.g., `support` can exist in different directories), it's essential to uniquely identify the parent folder using `parentFileFolderId`.

To generate unique IDs for each folder and file, you can use the `uuid` library.

### Summing Code Changes in Folders

For folders, the number of lines of code added, deleted, or modified is the sum of all the files and subfolders contained within them.

## Modification Metrics

- **Level**: Represents the level of the file or folder in the directory tree.
- **nbCodeLinesModified**: The number of lines of code modified between the start and end dates. This determines the size of the bubble.
- **modifiedRateAddOrDelCodeLines**: This value is calculated as:
  \[
  (\text{{nbAddCodeLines}} - \text{{nbDeleteCodeLines}}) * 100 / \text{{nbCodeLines}}
  \]
  This determines the color of the bubble.

#### Example 1:
We have two files:
- File1: `nbCodeLines = 650`, `nbAddCodeLines = 150`, `nbDeleteCodeLines = 25`
- File2: `nbCodeLines = 200`, `nbAddCodeLines = 150`, `nbDeleteCodeLines = 25`

Results:
- File1 `modifiedRateAddOrDelCodeLines = (150 - 25) * 100 / 650 = 19.23`
- File2 `modifiedRateAddOrDelCodeLines = (150 - 25) * 100 / 200 = 62.5`

Color representation:
- File1: Pale green
- File2: Light green

#### Example 2:
We have two files:
- File1: `nbCodeLines = 650`, `nbAddCodeLines = 25`, `nbDeleteCodeLines = 150`
- File2: `nbCodeLines = 200`, `nbAddCodeLines = 25`, `nbDeleteCodeLines = 150`

Results:
- File1 `modifiedRateAddOrDelCodeLines = (25 - 150) * 100 / 650 = -19.23`
- File2 `modifiedRateAddOrDelCodeLines = (25 - 150) * 100 / 200 = -62.5`

Color representation:
- File1: Yellow
- File2: Red

## Change Scope in the Repository

Key variables:
- **date**: The date of the commit. This represents the X-axis.
- **nbCodeLinesModified**: The number of lines of code modified between the start and end dates. This represents the Y-axis.
- **nbModifiedFiles**: The number of modified files in the commit (commit scope). This represents the size of the bubble.
- **typeOfFiles**: The predominant type of files modified (e.g., Configuration, Test, Documentation, Production). This represents the color of the bubble.

## Commit Statistics by Author

Key variables:
- **name**: The name of the author.
- **nbCommits**: The number of commits made by the author within the specified period (between the start and end dates). This represents the size of the bubble.
- **commitsCategory**: The number of commits made for each category of files. This represents the smaller bubbles inside the author’s bubble.
- **ListCommitsCategory**: A list containing `commitsCategory` objects for each category in the `ModifiedCategory` enum.

The color of the bubbles inside the author’s bubble corresponds to the file categories.
