import { CardInt } from './cardInterface';

export interface CategoryInt {
  category: string;
  'category-image': string;
  cards: CardInt[];
  id: number;
}
