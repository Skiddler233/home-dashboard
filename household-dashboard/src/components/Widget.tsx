import type { ReactNode } from "react";

type WidgetProps = {
  title: string;
  icon?: string;
  children: ReactNode;
};

export function Widget({ title, icon, children }: WidgetProps) {
  return (
    <section className="widget">
      <header className="widget-header">
        {icon && <span className="widget-icon">{icon}</span>}
        <h2 className="widget-title">{title}</h2>
      </header>
      <div className="widget-content">{children}</div>
    </section>
  );
}
