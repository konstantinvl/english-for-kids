import { Store } from '@reduxjs/toolkit';
import { newElem } from '../functions/createElem';
import { delay } from '../functions/delay';
import { Category } from './category';
import { GameCard } from './gameCard';
import { Statistics } from './stats';
import '../assets/styles/game.scss';
import filledStar from '../assets/images/filled-star.svg';
import emptyStar from '../assets/images/star-empty.svg';
import { playAudio } from '../functions/playAudio';

export class Game {
  private failSound: HTMLAudioElement;

  private successSound: HTMLAudioElement;

  private errorSound: HTMLAudioElement;

  private correctSound: HTMLAudioElement;

  private gameLength = 8;

  private wordsList: GameCard[] = [];

  private startBTN: HTMLElement;

  private rootElement: HTMLElement;

  public category: Category;

  private gameCounter = 0;

  private activeCard?: GameCard | null;

  private resultArray: boolean[] = [];

  private mistakesStats: Statistics;

  private header: HTMLElement;

  private score: HTMLElement;

  private fade: HTMLElement;

  private callBack: () => Promise<void>;

  constructor(sentCategory: Category, rootElem: HTMLElement, header: HTMLElement, stats: Statistics, call: () => Promise<void>) {
    // this.gameLength = 8;
    this.startBTN = newElem('div', ['start-game'], 'Start');
    // this.wordsList = [];
    this.category = sentCategory;
    this.rootElement = rootElem;
    // this.gameCounter = 0;
    // this.resultArray = [];
    this.header = header;
    this.header.append(this.startBTN);
    this.startBTN.addEventListener(
      'click',
      () => {
        this.startGame();
        this.startBTN.innerHTML = 'Repeat';
        this.startBTN.addEventListener('click', () => playAudio(this.wordsList[this.gameCounter].audio));
      },
      { once: true }
    );
    this.mistakesStats = stats;
    this.score = newElem('div', ['score']);
    this.fade = newElem('div', ['fade'], `Press "Start" to start the game`);
    this.successSound = new Audio(`./audio/success.mp3`);
    this.failSound = new Audio(`./audio/failure.mp3`);
    this.errorSound = new Audio(`./audio/error.mp3`);
    this.correctSound = new Audio(`./audio/correct.mp3`);
    this.callBack = call;
  }

  public preparingForGame(str: Store): void {
    const store = str;
    this.rootElement.append(this.fade, this.score);
    store.subscribe(() => this.startBTN.remove());
    this.resultArray = [];
    this.activeCard = null;
    this.gameCounter = 0;
    const gameCat = this.category.cards.sort(() => Math.random() - 0.5);
    gameCat.length = this.gameLength;
    gameCat.forEach((card) => {
      const newGameCard = new GameCard(card);
      this.wordsList.push(newGameCard);
      this.rootElement.append(newGameCard.element);
    });

    this.wordsList.sort(() => Math.random() - 0.5);
    this.wordsList.forEach((card) => {
      card.element.onclick = async () => {
        await this.cardCheck(card);
      };
    });
  }

  private counterIncrease(): void {
    this.gameCounter++;
    if (this.gameCounter === this.gameLength) {
      this.endGame();
    } else {
      this.startGame();
    }
  }

  private async cardCheck(card: GameCard): Promise<void> {
    if (card === this.activeCard) {
      (<GameCard>this.activeCard).element.onclick = null;
      this.activeCard?.card.classList.add('flipped');
      await this.correctAnswer();
      this.counterIncrease();
    } else {
      await this.wrongAnswer();
      // this.counterIncrease();
      /* card.element.addEventListener(
        'click',
        async () => {
          await this.cardCheck(card);
        },
        { once: true }
      ); */
    }
  }

  private startGame(): void {
    this.fade.remove();
    this.activeCard = this.wordsList[this.gameCounter];
    return playAudio(this.wordsList[this.gameCounter].audio);
  }

  private async correctAnswer(): Promise<void> {
    const img = new Image();
    img.src = filledStar;
    this.score.prepend(img);
    playAudio(this.correctSound);
    this.resultArray.push(true);
    await delay(1000);
  }

  private async wrongAnswer(): Promise<void> {
    const img = new Image();
    img.src = emptyStar;
    this.score.prepend(img);
    playAudio(this.errorSound);
    this.resultArray.push(false);
    this.mistakesStats.addMistake(<GameCard>this.activeCard);
    await delay(1000);
  }

  public async endGame(): Promise<void> {
    let count = 0;
    if (this.resultArray.includes(false)) {
      playAudio(this.failSound);
      this.resultArray.forEach((element) => !element && count++);
      this.rootElement.innerHTML = `${count} mistakes were made`;
    } else {
      playAudio(this.successSound);
      this.rootElement.innerHTML = `You have expert knowledge 
                in ${this.category.category} category`;
    }
    this.startBTN.remove();
    await delay(5000);
    this.rootElement.innerHTML = '';
    this.callBack();
  }
}
