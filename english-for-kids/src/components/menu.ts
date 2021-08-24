import { newElem } from '../functions/createElem';
import { BaseComponent } from './base-component';
import '../assets/styles/menu.scss';
import { STYLES } from '../functions/actions';

export class Menu extends BaseComponent {
  public burger: HTMLElement;

  public open: HTMLElement;

  public wrapper: HTMLElement;

  public login: HTMLElement;

  public status: STYLES = STYLES.CLOSED;

  public loginForm: HTMLFormElement;

  public formLoginInput: HTMLInputElement;

  public formPassInput: HTMLInputElement;

  public submitBtn: HTMLButtonElement;

  public logout: HTMLElement;

  public main: HTMLElement;

  constructor(rootelement: HTMLElement) {
    super('section', ['menu']);
    this.burger = newElem('div', ['menu_burger']);
    this.open = newElem('div', ['menu_open', 'closed']);
    this.wrapper = newElem('div', ['menu_open-wrapper']);
    this.main = newElem('div', ['menu_button'], `Main page`);
    this.login = newElem('div', ['login']);
    this.open.append(this.wrapper);
    this.element.append(this.burger, this.open);
    rootelement.append(this.element);

    this.login = newElem('div', ['login', 'menu_button'], `Login`);
    this.logout = newElem('div', ['menu_button'], `Logout`);

    this.loginForm = <HTMLFormElement>newElem('form', ['closed-login']);
    this.formLoginInput = <HTMLInputElement>newElem('input', ['login-input']);
    this.formPassInput = <HTMLInputElement>newElem('input', ['pass-input']);
    this.submitBtn = <HTMLButtonElement>newElem('button', ['submit-btn'], 'Submit');
    this.loginForm.append(this.formLoginInput, this.formPassInput, this.submitBtn);
    this.submitBtn.type = 'button';
    // this.login.append(this.loginForm);
    this.login.onclick = () => {
      this.loginForm.classList.toggle('closed-login');
    };

    // this.loginForm.onclick=()=>this.formSubmit();
  }

  public formSubmitCheck(): boolean {
    if (this.formLoginInput.value && this.formPassInput.value) {
      return true;
    }
    return false;
  }
}
