import { Fragment } from "@/generated/prisma";
import {useState} from "react";
import {ExternalLinkIcon,RefreshCcwIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";






interface Props{
    data: Fragment;
}
export function FragmentWeb({data}: Props) {
    const [copied, setCopied] = useState(false);
    const [FragmentKey, setFragmentKey] = useState(0);
    const onRefresh=() => {
        setFragmentKey(prevKey => prevKey + 1);};
    const handleCopy=() => {
        navigator.clipboard.writeText(data.sandboxUrl );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);};

  

    return (
        <div className="flex-col flex w-full h-full">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">

<Hint text="Refresh the sandbox" side="bottom" align="start">
                
<Button size="sm" variant="outline" onClick={onRefresh}>
    <RefreshCcwIcon/>
</Button>
</Hint>
<Hint text="Click to copy" side="bottom" >
<Button size="sm" 
variant="outline"
 onClick={handleCopy}
 className="flex-1 justify-start text-start font-normal" 
 disabled={!data.sandboxUrl || copied}>
    <span className="truncate">
        {data.sandboxUrl}
    </span>
</Button>
</Hint>
<Hint text="Open in new tab" side="bottom" align="start">
<Button
    size ="sm"
    disabled={!data.sandboxUrl}
    variant="outline"
    onClick={() => {
        if(!data.sandboxUrl) return;
        window.open(data.sandboxUrl, "_blank");
    }}
    ><ExternalLinkIcon />
</Button>
</Hint>

            </div>
            <iframe
            key={FragmentKey}
             className=" w-full h-full "
            sandbox="allow-scripts allow-same-origin allow-forms"
            loading="lazy"
            src={data.sandboxUrl}/>
          
        </div>
    );
}
