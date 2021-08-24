import { newElem } from '../functions/createElem';
import { CategoryInt } from '../interfaces/categoryInterface';
import { BaseComponent } from './base-component';
import { Category } from './category';
import { GameCard } from './gameCard';
import '../assets/styles/stats.scss';
import { categoryStat } from '../functions/categoryStat';

export class Statistics extends BaseComponent {
  private stats: Map<string, number>;

  private rootElement: HTMLElement;

  public statsBtn: HTMLElement;

  public clearBtn: HTMLElement;

  constructor(rootElem: HTMLElement) {
    super('div', ['stats']);
    this.stats = new Map();
    this.rootElement = rootElem;
    this.statsBtn = newElem('div', ['menu_button'], `Statistics`);
    this.clearBtn = newElem('div', [], `Clear`);
    this.clearBtn.onclick = () => this.clearStats();
  }

  public addMistake(card: GameCard): void {
    if (this.stats.has(card.translation)) {
      const mistake = <number>this.stats.get(card.translation);
      this.stats.set(card.translation, mistake + 1);
    } else {
      this.stats.set(card.translation, 1);
    }
  }

  public showStats(categories: CategoryInt[]): void {
    categories.forEach((category) => {
      const cat = new Category(category);
      this.rootElement.append(categoryStat(cat));
    });
  }

  private clearStats(): void {
    this.stats.clear();
    this.rootElement.innerHTML = '';
  }
}
