type SidebarNavProps = {
  items: readonly string[];
  activeIndex?: number;
};

export function SidebarNav({ items, activeIndex = 0 }: SidebarNavProps) {
  return (
    <nav className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item}
          className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
            index === activeIndex
              ? "bg-white text-slate-950"
              : "bg-slate-900 text-slate-300"
          }`}
        >
          {item}
        </div>
      ))}
    </nav>
  );
}
