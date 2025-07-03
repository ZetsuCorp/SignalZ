import { Home, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-64 px-4 py-6 shadow-xl",
        "bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]",
        "border-r border-[hsl(var(--sidebar-border))] transition-[width] duration-300 ease-in-out"
      )}
    >
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-lg font-bold tracking-wide text-[hsl(var(--sidebar-primary))]">
          SIGNALZ
        </h1>
      </div>

      <nav className="flex flex-col gap-4">
        <SidebarItem icon={<Home size={18} />} label="Feed" />
        <SidebarItem icon={<Plus size={18} />} label="Create" />
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md",
        "bg-[hsl(var(--sidebar-accent))]/0 hover:bg-[hsl(var(--sidebar-accent))]/30",
        "text-sm font-medium transition-colors duration-200"
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
