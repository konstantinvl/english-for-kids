import { createStore, Store } from '@reduxjs/toolkit';
import { Card } from './components/card';
import { Menu } from './components/menu';

import { CategoryInt } from './interfaces/categoryInterface';

import { Category } from './components/category';

import { ModeChange } from './components/modeChange';
import { reducer } from './functions/reduser';
import { Game } from './components/game';
import { Statistics } from './components/stats';
import { ADMINMODE, MODE, SITE, STYLES } from './functions/actions';
import { adminReducer } from './functions/adminReduser';
import { CategoryCreator } from './components/categoryCreator';

/* enum MODE {
  TRAIN = `TRAIN`,
  GAME = 'GAME',
} */

export class App {
  private main: HTMLElement;

  private headerElement: HTMLElement;

  changeMode: ModeChange;

  menu: Menu;

  categories?: CategoryInt[];

  activeCategory?: Category | null;

  store: Store;

  adminStore: Store;

  statistics: Statistics;

  catCreator: CategoryCreator;

  constructor(head: HTMLElement, mainEl: HTMLElement) {
    this.main = mainEl;
    this.headerElement = head;
    this.menu = new Menu(this.headerElement);
    this.changeMode = new ModeChange(this.headerElement);
    this.start();
    this.menu.burger.onclick = () => this.menuOpening();
    this.menu.logout.onclick = () => {
      this.adminStore.dispatch({ type: 'OUT' });
      this.menuOpening();
    };
    this.menu.main.onclick = () => {
      this.mainPage();
      this.menuOpening();
    };

    this.changeMode.element.onclick = () => {
      this.store.dispatch({ type: this.changeMode.changeMode() });
      // this.changeMode.changeMode();
    };
    this.adminStore = createStore(adminReducer, { value: ADMINMODE.OUT });
    this.store = createStore(reducer, { value: MODE.TRAIN });
    // console.log(this.store.getState());
    this.store.subscribe(() => this.activateCategory());
    this.adminStore.subscribe(() => this.adminMode());

    this.statistics = new Statistics(mainEl);

    this.catCreator = new CategoryCreator();
    this.catCreator.element.onsubmit = async (e) => this.createCategory(e);
  }

  async start(): Promise<void> {
    this.activeCategory = null;
    const cats = await fetch(`${SITE}/api/categories`);
    this.categories = <CategoryInt[]>await cats.json();
    this.menu.wrapper.innerHTML = '';
    this.menu.wrapper.append(this.menu.main);
    this.categories.forEach((category) => {
      const newCat = new Category(category);
      this.main.append(newCat.element);
      this.menu.wrapper.append(newCat.menuButton);
      newCat.element.addEventListener('click', () => {
        this.activeCategory = newCat;
        this.activateCategory();
      });
      newCat.menuButton.onclick = () => {
        this.activeCategory = newCat;
        this.activateCategory();
        this.menuOpening();
      };
    });
    this.menu.wrapper.append(this.statistics.statsBtn, this.menu.login, this.menu.loginForm);
    this.menu.submitBtn.onclick = () => {
      this.startAdmin();
      this.menuOpening();
      // this.menu.loginForm.classList.toggle('closed-login');
    };
    this.statistics.statsBtn.onclick = () => this.showMistakes(<CategoryInt[]>this.categories);
  }

  menuOpening(): void {
    if (this.menu.status === STYLES.CLOSED) {
      this.menu.burger.style.backgroundImage = `url(./img/x.png)`;
      this.menu.open.classList.remove(STYLES.CLOSED);
      this.menu.open.classList.add(STYLES.WIDE);
      this.main.classList.add(STYLES.RIGHT);
      this.menu.open.addEventListener(
        'transitionend',
        () => {
          this.menu.open.classList.add(STYLES.OPENED);
          document.addEventListener('click', (ev) => this.menuClosing(ev));
          this.menu.status = STYLES.OPENED;
        },
        { once: true }
      );
    } else {
      this.close();
    }
  }

  private menuClosing(event: MouseEvent): void {
    const elem = <HTMLElement>event.target;
    if (elem.closest('section') !== this.menu.element && this.menu.status === STYLES.OPENED) {
      this.close();
    }
  }

  private close(): void {
    this.menu.burger.style.backgroundImage = `url(./img/menu-button.png)`;
    this.menu.open.classList.remove(STYLES.OPENED);
    this.menu.open.addEventListener(
      'transitionend',
      () => {
        this.menu.open.classList.remove(STYLES.WIDE);
        this.main.classList.remove(STYLES.RIGHT);
        this.menu.open.addEventListener(
          'transitionend',
          () => {
            this.menu.open.classList.add(STYLES.CLOSED);
            this.menu.status = STYLES.CLOSED;
          },
          { once: true }
        );
      },
      { once: true }
    );
  }

  private clearField(): void {
    this.main.innerHTML = '';
  }

  private activateCategory(/* category?: Category | undefined */): void {
    /* if (category) {
      this.clearField();
      if (this.store.getState().value === MODE.GAME) {
        this.startGame(category);
      } else {
        category.cards.forEach((card) => {
          const newCard = new Card(card);
          this.main.append(newCard.element);
        });
        this.showActiveCategory(category);
      }
    } else */ if (this.activeCategory) {
      this.clearField();
      // category = this.activeCategory;
      if (this.store.getState().value === MODE.GAME) {
        this.startGame(this.activeCategory);
      } else {
        this.activeCategory.cards.forEach((card) => {
          const newCard = new Card(card);
          this.main.append(newCard.element);
        });
        this.showActiveCategory(this.activeCategory);
      }
    }
  }

  private showActiveCategory(category: Category): void {
    if (this.activeCategory) {
      this.activeCategory.menuButton.classList.remove(STYLES.ACTIVE);
    }
    this.activeCategory = category;
    this.activeCategory.menuButton.classList.add(STYLES.ACTIVE);
  }

  private startGame(category: Category): void {
    const game = new Game(category, this.main, this.headerElement, this.statistics, this.start.bind(this));
    game.preparingForGame(this.store);
    this.showActiveCategory(category);
  }

  private showMistakes(categories: CategoryInt[]): void {
    this.clearField();
    this.statistics.showStats(categories);
  }

  private async startAdmin(): Promise<boolean> {
    this.activeCategory = null;
    await this.renderAdmin();
    this.adminStore.dispatch({ type: 'IN' });

    return false;
  }

  private async renderAdmin(): Promise<void> {
    this.clearField();
    const cats = await fetch(`${SITE}/api/categories`);
    this.categories = <CategoryInt[]>await cats.json();
    this.menu.wrapper.innerHTML = '';
    this.menu.wrapper.append(this.menu.main);
    this.main.append(this.catCreator.element);
    this.categories.forEach((category) => {
      const newCat = new Category(category);
      newCat.element.append(newCat.update, newCat.add, newCat.delete, newCat.quantity);
      this.main.append(newCat.element);
      this.menu.wrapper.append(newCat.menuButton);
      newCat.element.addEventListener('click', () => {
        this.activeCategory = newCat;
        this.activateCategory();
      });
      newCat.menuButton.onclick = () => {
        this.activeCategory = newCat;
        this.activateCategory();
        this.menuOpening();
      };
    });
    this.menu.wrapper.append(this.statistics.statsBtn, this.menu.login, this.menu.loginForm);

    this.statistics.statsBtn.onclick = () => this.showMistakes(<CategoryInt[]>this.categories);
  }

  private async createCategory(e: Event): Promise<void> {
    e.preventDefault();
    const form = new FormData(<HTMLFormElement>this.catCreator.element);
    form.set('category-image', 'img/category.png');
    const cat = {
      category: this.catCreator.name.value,
      'category-image': 'img/category.png',
    };
    const response = await fetch(`${SITE}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(cat),
    });

    const result = await response.json();
    const newCat = new Category(result);
    this.main.append(newCat.element);
    newCat.element.append(newCat.update, newCat.add, newCat.delete, newCat.quantity);
  }

  private adminMode(): void {
    if (this.adminStore.getState().value === 'IN') {
      this.menu.loginForm.classList.toggle('closed-login');
      this.menu.login.remove();
      this.menu.wrapper.append(this.menu.logout);
    }
    if (this.adminStore.getState().value === 'OUT') {
      this.menu.logout.remove();
      this.menu.wrapper.append(this.menu.login);
      this.clearField();
      this.start();
    }
  }

  private mainPage(): void {
    if (this.adminStore.getState().value === 'IN') {
      this.startAdmin();
    }
    if (this.adminStore.getState().value === 'OUT') {
      this.clearField();
      this.start();
    }
  }

  // router(element: HTMLElement, rout: string) {}
}
