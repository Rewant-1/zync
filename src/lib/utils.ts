import { type TreeItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertFilesToTreeItems(files: {
  [path: string]: string;
}): TreeItem[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  const tree: TreeNode = {};
  const sortedPaths = Object.keys(files).sort();

  // Build tree structure from file paths
  for (const path of sortedPaths) {
    if (!path || path.trim() === "") continue;

    const parts = path.split("/").filter((part) => part.length > 0);
    if (parts.length === 0) continue;

    let current = tree;

    // Navigate/create directory structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as TreeNode;
    }

    // Add file as leaf node
    const fileName = parts[parts.length - 1];
    current[fileName] = null;
  }

  function convertNode(node: TreeNode): TreeItem[] {
    const entries = Object.entries(node);
    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        // Leaf node (file)
        children.push(key);
      } else {
        // Directory node with children
        const subTree = convertNode(value);
        children.push([key, subTree]);
      }
    }

    return children;
  }

  return convertNode(tree);
}
