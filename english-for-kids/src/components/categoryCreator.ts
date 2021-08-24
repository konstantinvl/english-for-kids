import { newElem } from '../functions/createElem';
import { BaseComponent } from './base-component';

export class CategoryCreator extends BaseComponent {
  public name: HTMLInputElement;

  public image: HTMLInputElement;

  public submit: HTMLButtonElement;

  constructor() {
    super('form', ['category']);
    this.name = <HTMLInputElement>newElem('input', []);
    this.image = <HTMLInputElement>newElem('input', []);
    this.submit = <HTMLButtonElement>newElem('button', [], 'Submit');
    this.element.append(
      newElem('label', [], `Create Category`),
      newElem('label', [], `Category Name`),
      this.name,
      // newElem('label',[],`Category Image`),
      // this.image,
      this.submit
    );
    this.name.name = 'category';
  }
}
