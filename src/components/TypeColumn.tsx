import type { TodoItem, ItemType } from '../types';
import { ItemButton } from './ItemButton';

interface TypeColumnProps {
  type: ItemType;
  items: TodoItem[];
  onItemClick: (item: TodoItem) => void;
}

export function TypeColumn({ type, items, onItemClick }: TypeColumnProps) {
  return (
    <div className="type-column">
      <div className="type-column__header">{type}</div>
      <div className="type-column__items">
        {items.map((item) => (
          <ItemButton key={item.name} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}
