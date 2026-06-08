export interface TodoItem {
  type: ItemType;
  name: string;
}

export type ItemType = 'Fruit' | 'Vegetable';

export interface ColumnItems {
  [key: string]: TodoItem[];
}

export type TodoAction =
  | { type: 'MOVE_TO_COLUMN'; payload: TodoItem }
  | { type: 'MOVE_BACK_TO_LIST'; payload: TodoItem };

export interface TodoState {
  mainList: TodoItem[];
  columns: ColumnItems;
}
