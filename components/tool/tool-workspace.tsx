import type { ReactNode } from 'react';

type ToolWorkspaceProps = {
  label: string;
  children: ReactNode;
  actions: ReactNode;
};

export function ToolWorkspace({ label, children, actions }: ToolWorkspaceProps) {
  return (
    <div className="workspace">
      <div className="card workspace-card">
        <div className="workspace-bar">
          <strong>{label}</strong>
          <span>Local processing</span>
        </div>
        {children}
        <div className="actions">{actions}</div>
      </div>
    </div>
  );
}
