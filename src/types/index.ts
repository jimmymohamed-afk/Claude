export type DietaryFlag =
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'spicy'
  | 'contains-nuts'
  | 'halal'
  | 'new'
  | 'popular';

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageBase64?: string;
  imageUrl?: string;
  dietaryFlags: DietaryFlag[];
  available: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageBase64?: string;
  sortOrder: number;
  visible: boolean;
}

export type FontFamily = 'inter' | 'playfair' | 'lato' | 'merriweather' | 'poppins';
export type BorderRadiusOption = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type LayoutOption = 'grid' | 'list';
export type CardStyle = 'minimal' | 'image-top' | 'image-left' | 'compact';

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily: FontFamily;
  borderRadius: BorderRadiusOption;
  layout: LayoutOption;
  cardStyle: CardStyle;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  hideUnavailableItems: boolean;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  logoBase64?: string;
  coverImageBase64?: string;
  phone?: string;
  address?: string;
  website?: string;
  openingHours?: string;
}

export interface AppData {
  version: number;
  restaurantInfo: RestaurantInfo;
  theme: ThemeConfig;
  categories: Category[];
  items: MenuItem[];
  lastModified: string;
}

export type Action =
  | { type: 'SET_RESTAURANT_INFO'; payload: Partial<RestaurantInfo> }
  | { type: 'SET_THEME'; payload: Partial<ThemeConfig> }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'REORDER_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_ITEM'; payload: MenuItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'REORDER_ITEMS'; payload: MenuItem[] }
  | { type: 'IMPORT_DATA'; payload: AppData }
  | { type: 'RESET_TO_DEFAULTS' };
