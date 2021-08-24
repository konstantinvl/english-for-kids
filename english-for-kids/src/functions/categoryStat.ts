import { Category } from '../components/category';
import { newElem } from './createElem';

export function categoryStat(category: Category): HTMLElement {
  const newStatCat = newElem('div', ['stat-cat']);
  const statCatName = newElem('div', [], `${category.category}`);
  newStatCat.append(statCatName);
  category.cards.forEach((card) => {
    newStatCat.append(newElem('div', [], `${card.word}  -  ${card.translation}`));
  });
  return newStatCat;
}
