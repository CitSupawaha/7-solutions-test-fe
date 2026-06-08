import type { TodoItem } from '../types';

interface ItemButtonProps {
  item: TodoItem;
  onClick: (item: TodoItem) => void;
}

export function ItemButton({ item, onClick }: ItemButtonProps) {
  return (
    <button
      className="item-btn"
      onClick={() => onClick(item)}
      type="button"
    >
      {item.name}
    </button>
  );
}
