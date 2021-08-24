import { newElem } from '../functions/createElem';
import { CardInt } from '../interfaces/cardInterface';
import { CategoryInt } from '../interfaces/categoryInterface';
import { BaseComponent } from './base-component';
import '../assets/styles/category.scss';
import { SITE } from '../functions/actions';

export class Category extends BaseComponent {
  public category: string;

  private id: number;

  private image: HTMLElement;

  public cards: CardInt[];

  private top: HTMLElement;

  private name: HTMLElement;

  public menuButton: HTMLElement;

  public add: HTMLElement;

  public delete: HTMLElement;

  public update: HTMLElement;

  public quantity: HTMLElement;

  constructor(newCat: CategoryInt) {
    super('div', ['category']);
    this.category = newCat.category;
    this.cards = newCat.cards;
    this.id = newCat.id;
    this.top = newElem('div', ['category_top']);
    this.name = newElem('div', ['category_name'], `${this.category}`);
    this.image = newElem('div', ['category_image']);
    this.image.style.backgroundImage = `url(./${newCat['category-image']})`;
    this.element.append(this.top, this.name, this.image);
    this.menuButton = newElem('div', ['menu_button'], `${this.category}`);

    this.quantity = newElem('div', ['quantity'], `${this.cards.length} words`);

    this.add = newElem('div', ['category_add-word', 'round', 'invis'], `+ word`);
    this.delete = newElem('div', ['category_delete', 'round', 'invis'], `- cat`);
    this.update = newElem('div', ['category_update', 'round'], `upd`);
    this.update.addEventListener('click', (e) => this.adminOptions(e));
    this.delete.addEventListener('click', (e) => this.deleteCat(e));
  }

  private adminOptions(e: MouseEvent): void {
    e.cancelBubble = true;
    this.add.classList.toggle('invis');
    this.delete.classList.toggle('invis');
  }

  private async deleteCat(e: MouseEvent): Promise<void | Error> {
    e.cancelBubble = true;
    try {
      await fetch(`${SITE}/api/categories/${this.id}`, { method: 'DELETE' });
    } catch (error) {
      return new Error(error);
    }

    return this.element.remove();
  }
}
