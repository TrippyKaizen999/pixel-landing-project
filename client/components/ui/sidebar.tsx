import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Upload,
  User,
  Brain,
  MessageSquare,
  Settings,
  Home,
  Trophy,
  Clock,
  BarChart3,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview and stats",
  },
  {
    title: "Upload",
    href: "/upload",
    icon: Upload,
    description: "Upload clips & screenshots",
  },
  {
    title: "Player Profile",
    href: "/profile",
    icon: User,
    description: "Profile & analytics",
  },
  {
    title: "AI Coach",
    href: "/ai-coach",
    icon: Brain,
    description: "AI feedback & coaching",
  },
  {
    title: "Game History",
    href: "/history",
    icon: Clock,
    description: "Timeline of games",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col",
        className,
      )}
    >
      {/* Logo/Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ow-orange to-ow-orange-dark rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-ow-dark-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-ow-orange">OW Coach</h1>
            <p className="text-xs text-muted-foreground">Desktop App</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn("sidebar-item group", isActive && "active")}
            >
              <Icon className="w-5 h-5 transition-colors" />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground group-hover:text-ow-orange/70">
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-ow-orange rounded-full animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          <p>Overwatch 2 Coaching App</p>
          <p className="text-ow-orange">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
