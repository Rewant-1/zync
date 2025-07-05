import { type TreeItem } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export function convertFilesToTreeItems(
files:{[path:string]: string} ,
): TreeItem[]{
  interface TreeNode {
    [key:string]: TreeNode | null;
  }
  
  const tree: TreeNode = {};
  const sortedPaths = Object.keys(files).sort();
  
  for (const path of sortedPaths) {
    // Handle empty paths or paths with only separators
    if (!path || path.trim() === '') continue;
    
    const parts = path.split('/').filter(part => part.length > 0);
    if (parts.length === 0) continue;
    
    let current = tree;
    
    // Navigate through all parts except the last one (which is the file)
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as TreeNode;
    }
    
    // Add the file (last part) to the current directory
    const fileName = parts[parts.length - 1];
    current[fileName] = null;
  }

  function convertNode(node: TreeNode): TreeItem[] {
    const entries = Object.entries(node);
    const children: TreeItem[] = [];
    
    for (const [key, value] of entries) {
      if (value === null) {
        // It's a file
        children.push(key);
      } else {
        // It's a folder with children
        const subTree = convertNode(value);
        children.push([key, subTree]);
      }
    }
    
    return children;
  }
  
  return convertNode(tree);
}