"use client";

import { useEffect, useState } from "react";
import { dark } from "@clerk/themes";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import { UserButton } from "@clerk/nextjs";
interface Props {
  showName?: boolean;
}

export const UserControl = ({ showName }: Props) => {
  const [mounted, setMounted] = useState(false);
  const currentTheme = useCurrentTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-8 rounded-md bg-muted animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-2">
      <UserButton
        showName={showName}
        appearance={{
          elements: {
            userButtonBox: "rounded-md!",
            userButtonAvatarBox: "rounded-md! size-8",
            userButtonTrigger: "rounded-md!",
          },
          baseTheme: currentTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
};
