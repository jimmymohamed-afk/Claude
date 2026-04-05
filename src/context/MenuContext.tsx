import React, { createContext, useContext } from 'react';
import type { Dispatch } from 'react';
import type { AppData, Action } from '../types';
import { useMenuStore } from '../hooks/useMenuStore';
import { useTheme } from '../hooks/useTheme';

interface MenuContextType {
  state: AppData;
  dispatch: Dispatch<Action>;
}

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useMenuStore();
  useTheme(state.theme);
  return <MenuContext.Provider value={{ state, dispatch }}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
