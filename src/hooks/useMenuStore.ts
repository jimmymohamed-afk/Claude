import { useReducer, useEffect } from 'react';
import type { AppData, Action } from '../types';
import { DEFAULT_DATA } from '../data/defaults';
import { loadData, saveData } from '../utils/storage';

function reducer(state: AppData, action: Action): AppData {
  const now = new Date().toISOString();
  switch (action.type) {
    case 'SET_RESTAURANT_INFO':
      return { ...state, restaurantInfo: { ...state.restaurantInfo, ...action.payload }, lastModified: now };
    case 'SET_THEME':
      return { ...state, theme: { ...state.theme, ...action.payload }, lastModified: now };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload], lastModified: now };
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c), lastModified: now };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
        items: state.items.filter(i => i.categoryId !== action.payload),
        lastModified: now,
      };
    case 'REORDER_CATEGORIES':
      return { ...state, categories: action.payload, lastModified: now };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload], lastModified: now };
    case 'UPDATE_ITEM':
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? action.payload : i), lastModified: now };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload), lastModified: now };
    case 'REORDER_ITEMS':
      return { ...state, items: action.payload, lastModified: now };
    case 'IMPORT_DATA':
      return { ...action.payload, lastModified: now };
    case 'RESET_TO_DEFAULTS':
      return { ...DEFAULT_DATA, lastModified: now };
    default:
      return state;
  }
}

export function useMenuStore() {
  const initialState = loadData() ?? DEFAULT_DATA;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveData(state);
  }, [state]);

  return { state, dispatch };
}
