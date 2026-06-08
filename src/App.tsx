import { MainList } from './components/MainList';
import { TypeColumn } from './components/TypeColumn';
import { useTodoList } from './hooks/useTodoList';
import { ITEM_TYPES } from './data/items';
import type { ItemType } from './types';
import './App.css';

function App() {
  const { mainList, columns, moveToColumn, moveBackToList } = useTodoList();

  return (
    <div className="app">
      <div className="board">
        <MainList items={mainList} onItemClick={moveToColumn} />

        {ITEM_TYPES.map((type) => (
          <TypeColumn
            key={type}
            type={type as ItemType}
            items={columns[type] ?? []}
            onItemClick={moveBackToList}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
