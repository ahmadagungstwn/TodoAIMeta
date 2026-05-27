export function ChecklistItem({ title, done, onToggle }: { title: string; done: boolean; onToggle?: () => void }) {
  return (
    <button className="checklist-item" type="button" onClick={onToggle}>
      <span className={done ? 'checkbox done' : 'checkbox'}>{done ? '✓' : ''}</span>
      <span>{title}</span>
    </button>
  );
}
