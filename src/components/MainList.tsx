import type { TodoItem } from '../types';
import { ItemButton } from './ItemButton';

interface MainListProps {
  items: TodoItem[];
  onItemClick: (item: TodoItem) => void;
}

export function MainList({ items, onItemClick }: MainListProps) {
  return (
    <div className="main-list">
      {items.map((item) => (
        <ItemButton key={item.name} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}
