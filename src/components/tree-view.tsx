import { TreeItem } from "@/types"
import{
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupContent,
    SidebarMenuSub,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar"
import {ChevronRightIcon, FileIcon, FolderIcon} from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"


interface TreeViewProps {
    data: TreeItem[];
    value?: string | null;
    onSelect?: (value: string) => void;};

    export const TreeView = ({
    data,
    value,
    onSelect,
}: TreeViewProps) => {
    return(
<SidebarProvider>
        <Sidebar collapsible="none" className="w-full">
            <SidebarContent >
                    <SidebarGroup>
                        <SidebarGroupContent>
                        <SidebarMenu>
                            {data.map((item, index) => (
                                <Tree
                                    key={index}
                                    item={item}
                                    selectedItem={value}
                                    onSelect={onSelect}
                                    parentPath=""
                                />))}
                        </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    
                
            </SidebarContent>
            <SidebarRail />
            </Sidebar>
            </SidebarProvider>
    )};

    interface TreeProps {
        item: TreeItem;
        selectedItem?: string | null;
        onSelect?: (value: string) => void;
        parentPath: string;
    };

    const Tree = ({ item, selectedItem, onSelect, parentPath }: TreeProps) => {
        if (typeof item === 'string') {
            // It's a file
            const currentPath = parentPath ? `${parentPath}/${item}` : item;
            const isSelected = selectedItem === currentPath;
            return (
                <SidebarMenuButton
                    isActive={isSelected}
                    onClick={() => onSelect?.(currentPath)}
                    className="data-[active=true]:bg-transparent">
                    <FileIcon />
                    <span className="truncate">{item}</span>
                </SidebarMenuButton>
            )
        }

        // It's a folder [name, children[]]
        const [name, children] = item;
        const currentPath = parentPath ? `${parentPath}/${name}` : name;

        return (
            <SidebarMenuItem>
                <Collapsible className="group/collapsible [&[data-state-open]>button>svg:first-child]:rotate-90" defaultOpen>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <ChevronRightIcon className="transition-transform"/>
                            <FolderIcon />
                            <span className="truncate">{name}</span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {children.map((subItem: TreeItem, index: number) => (
                                <Tree 
                                    key={index}
                                    item={subItem}
                                    selectedItem={selectedItem}
                                    onSelect={onSelect}
                                    parentPath={currentPath} 
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuItem>
        )
    };

      