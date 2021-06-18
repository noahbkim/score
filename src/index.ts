import {Renderer} from "./renderer";
import {Score} from "./notation";

window.addEventListener('load', () => {
  for (const target of document.getElementsByClassName('line') as any as Array<SVGElement>) {
    const renderer = new Renderer(target, {uniform: true, wrap: false});
    const score = new Score();
    renderer.render(score);
  }
});
