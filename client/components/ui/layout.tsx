import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          "flex-1 overflow-auto",
          "bg-gradient-to-br from-background via-background to-ow-dark-500/5",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
