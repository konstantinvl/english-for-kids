import { App } from './app';
import { newElem } from './functions/createElem';
import './assets/styles/index.scss';
import './assets/styles/colors.scss';

const header = newElem('header', ['header']);
const footer = newElem(
  'footer',
  [],
  `2021 <a class="link" href="https://github.com/konstantinvl">https://github.com/konstantinvl</a>
<a class="link" href="https://rs.school/js/">
<img src="./img/rs_school_js.svg" alt=""></a>`
);
const main = newElem('main', ['start']);
document.body.append(header, main, footer);

window.onload = () => {
  const app = new App(header, main);
};
