import {Context, Notation} from "./context";
import * as svg from './svg';

export class Bar {
  public readonly context: Context;
  public readonly notation: Notation;
  public readonly root: SVGSVGElement;
  public beats: number = 4;
  public subdivisions: number = 2;

  public constructor(context: Context, notation: Notation) {
    this.context = context;
    this.notation = notation;
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.root.classList.add("bar");
    this.render();
  }

  public dump(): any {
    return {
      notation: this.notation.dump(),
    };
  }

  public load(data: any): void {
    this.notation.load(data.notation);
  }

  public render(): void {
    const width = this.notation.beats * this.notation.subdivisions * this.context.unit;
    const height = (this.notation.lines - 1) * this.context.unit + 1;
    this.root.style.width = `${width}px`;
    this.root.style.height = `${height}px`;
    this.root.setAttribute("viewBox", `0 0 ${width} ${height}`);

    for (let i = 0; i < this.notation.beats; ++i) {
      const x = i * this.subdivisions * this.context.unit;
      this.root.appendChild(svg.rect({
        x: x,
        y: 0,
        width: 2,
        height: height,
        fill: "white",
      }));

      for (let j = 1; j < this.notation.subdivisions; ++i) {
        const dx = j * this.context.unit
        this.root.appendChild(svg.rect({
          x: x + dx,
          y: 0,
          width: 1,
          height: height,
          fill: "white",
        }));
      }
    }

    for (let i = 0; i < this.notation.lines; ++i) {
      const y = i * this.context.unit;
      this.root.appendChild(svg.rect({
        x: 0,
        y: y,
        width: width,
        height: 1,
        fill: "white",
      }));
    }
  }
}
