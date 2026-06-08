import { useReducer, useRef, useCallback, useEffect } from 'react';
import type { TodoItem, TodoState, TodoAction } from '../types';
import { INITIAL_ITEMS, ITEM_TYPES, AUTO_RETURN_DELAY_MS } from '../data/items';

const createInitialState = (): TodoState => ({
  mainList: [...INITIAL_ITEMS],
  columns: Object.fromEntries(ITEM_TYPES.map((type) => [type, []])),
});

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'MOVE_TO_COLUMN': {
      const item = action.payload;
      return {
        mainList: state.mainList.filter((i) => i.name !== item.name),
        columns: {
          ...state.columns,
          [item.type]: [...(state.columns[item.type] ?? []), item],
        },
      };
    }

    case 'MOVE_BACK_TO_LIST': {
      const item = action.payload;
      return {
        mainList: [...state.mainList, item],
        columns: {
          ...state.columns,
          [item.type]: (state.columns[item.type] ?? []).filter((i) => i.name !== item.name),
        },
      };
    }

    default:
      return state;
  }
}

export function useTodoList() {
  const [state, dispatch] = useReducer(todoReducer, undefined, createInitialState);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const clearItemTimer = useCallback((itemName: string) => {
    const existingTimer = timersRef.current.get(itemName);
    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(itemName);
    }
  }, []);

  const moveToColumn = useCallback(
    (item: TodoItem) => {
      // Clear any existing timer just in case
      clearItemTimer(item.name);
      
      dispatch({ type: 'MOVE_TO_COLUMN', payload: item });

      // Set auto-return timer (5 seconds)
      const timer = setTimeout(() => {
        dispatch({ type: 'MOVE_BACK_TO_LIST', payload: item });
        timersRef.current.delete(item.name);
      }, AUTO_RETURN_DELAY_MS);

      timersRef.current.set(item.name, timer);
    },
    [clearItemTimer],
  );

  const moveBackToList = useCallback(
    (item: TodoItem) => {
      clearItemTimer(item.name);
      dispatch({ type: 'MOVE_BACK_TO_LIST', payload: item });
    },
    [clearItemTimer],
  );

  return {
    mainList: state.mainList,
    columns: state.columns,
    moveToColumn,
    moveBackToList,
  };
}
