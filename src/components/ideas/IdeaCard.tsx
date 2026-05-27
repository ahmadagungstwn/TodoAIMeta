import { sourceLabel, statusLabel } from '../../lib/mock-data';
import type { Category, Idea } from '../../types';
import { BulbIcon } from '../icons/Icons';
import { StatusBadge, CategoryBadge } from '../ui/Badges';

export function IdeaCard({ idea, categories = [], compact = false }: { idea: Idea; categories?: Category[]; compact?: boolean }) {
  const category = categories.find((item) => item.id === idea.category_id);

  if (compact) {
    return (
      <a className="latest-idea-card" href={`/ideas/${idea.id}`}>
        <div className="idea-icon-tile">
          <div className="idea-icon-core">
            <BulbIcon />
          </div>
        </div>
        <div className="idea-card-main">
          <strong>{idea.title}</strong>
          <span>
            {category?.name ?? 'Tanpa kategori'} · {statusLabel[idea.status]}
          </span>
        </div>
        <StatusBadge status={idea.status} />
      </a>
    );
  }

  return (
    <a className="idea-list-card" href={`/ideas/${idea.id}`}>
      <div className="idea-list-head">
        <strong>{idea.title}</strong>
        <span className="source-label-compact">{sourceLabel[idea.source_type]}</span>
      </div>
      <p>{idea.description}</p>
      <div className="badge-row">
        <CategoryBadge color={category?.color}>{category?.name ?? 'Tanpa kategori'}</CategoryBadge>
        <StatusBadge status={idea.status} />
      </div>
    </a>
  );
}
