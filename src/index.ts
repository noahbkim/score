import {Renderer} from "./renderer";
import {Score} from "./notation";

window.addEventListener('load', () => {
  const target = document.getElementsByClassName('line')[0] as unknown as SVGElement;
  const renderer = new Renderer(target, {uniform: true, wrap: false});
  const score = new Score();
  renderer.render(score);
});
