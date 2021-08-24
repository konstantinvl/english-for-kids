import '../assets/styles/card.scss';
import { newElem } from '../functions/createElem';
import { CardInt } from '../interfaces/cardInterface';
import { BaseComponent } from './base-component';

/* enum STATUS {
  FLIPPED = 'flipped',
  NOTFLIPPED = 'notflipped',
} */

export class Card extends BaseComponent {
  private word: string;

  private translation: string;

  private image: string;

  private audioSrc: string;

  private audio: HTMLAudioElement;

  private front: HTMLElement;

  private back: HTMLElement;

  private card: HTMLElement;

  private rotate: HTMLElement;

  private update: HTMLElement;

  constructor(newCard: CardInt) {
    super('div', ['card-wrapper']);
    this.word = newCard.word;
    this.translation = newCard.translation;
    this.image = newCard.image;
    this.audioSrc = newCard.audioSrc;
    this.audio = new Audio(`./${this.audioSrc}`);
    this.card = newElem('div', ['card']);
    this.front = newElem('div', ['card-front'], `${this.word}`);
    this.front.style.backgroundImage = `url("./${this.image}")`;
    this.back = newElem('div', ['card-back'], `${this.translation}`);
    this.card.append(this.front, this.back, this.audio);
    this.update = newElem('div', ['category_update', 'round'], `upd`);
    this.element.append(this.card, this.update);

    this.rotate = newElem('div', ['rotate']);
    this.front.append(this.rotate);
    this.rotate.onclick = () => this.flip();
    this.front.onclick = () => this.play();

    this.back.addEventListener('mouseout', () => {
      this.card.classList.remove('flipped');
    });

    this.update = newElem('div', ['category_update', 'round'], `upd`);
  }

  private flip(): void {
    this.card.classList.add('flipped');
  }

  private play(): void {
    this.audio.currentTime = 0;
    this.audio.play();
  }
}
