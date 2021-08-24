export function newElem(tag: keyof HTMLElementTagNameMap, styles: string[] = [], text?: string): HTMLElement {
  const element = document.createElement(tag);
  element.classList.add(...styles);
  element.innerHTML = text || '';
  return element;
}
