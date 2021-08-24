import { newElem } from '../functions/createElem';
import { CardInt } from '../interfaces/cardInterface';
import { BaseComponent } from './base-component';

export class GameCard extends BaseComponent {
  public audio: HTMLAudioElement;

  public card: HTMLElement;

  public front: HTMLElement;

  public translation: string;

  constructor(newCard: CardInt) {
    super('div', ['card-wrapper']);
    this.audio = new Audio(`./${newCard.audioSrc}`);
    this.card = newElem('div', ['card']);
    this.front = newElem('div', ['game-card-front']);
    this.front.style.backgroundImage = `url("./${newCard.image}")`;
    this.card.append(this.front, this.audio);
    this.element.append(this.card);
    this.translation = newCard.translation;
  }
}
