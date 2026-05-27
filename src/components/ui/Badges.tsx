import { statusLabel, sourceLabel } from '../../lib/mock-data';
import type { IdeaStatus, SourceType } from '../../types';

export function StatusBadge({ status }: { status: IdeaStatus }) {
  return <span className={`status-badge ${status}`}>{statusLabel[status]}</span>;
}

export function CategoryBadge({ children, color }: { children: string; color?: string }) {
  const style = color ? { color: '#fff', backgroundColor: color, border: 'none' } : {};
  return (
    <span className="category-badge" style={style}>
      {children}
    </span>
  );
}

export function SourceBadge({ source }: { source: SourceType }) {
  return <span className={`source-badge ${source}`}>{sourceLabel[source]}</span>;
}
