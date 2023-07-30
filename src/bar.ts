import {Context, Notation} from "./context";
import {Note} from "./note";
import * as svg from './svg';

export class Bar {
  private readonly context: Context;
  private readonly notation: Notation;
  public readonly root: SVGSVGElement;
  public readonly notes: Array<Array<Note>>;

  public constructor(context: Context, notation: Notation) {
    this.context = context;
    this.notation = notation;
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.root.classList.add("bar");
    this.root.style.marginRight = `-${2 * this.context.pad()}px`
    this.notes = [];
    for (let i = 0; i < this.notation.beats * this.notation.subdivisions; ++i) {
      const frame = [];
      for (let j = 0; j < this.notation.lines; ++j) {
        const note = new Note(this.context);
        frame.push(note);
      }
      this.notes.push(frame);
    }
    this.clear();
  }

  public clear(): void {
    this.root.replaceChildren();
    const width = this.notation.beats * this.notation.subdivisions * this.context.dx;
    const height = (this.notation.lines - 1) * this.context.dy + 1;
    const pad = this.context.pad();
    this.root.style.width = `${width + 2 * pad}px`;
    this.root.style.height = `${height + 2 * pad}px`;
    this.root.setAttribute("viewBox", `-${pad} -${pad} ${width + 2 * pad} ${height + 2 * pad}`);

    for (let i = 0; i < this.notation.beats; ++i) {
      const x = i * this.notation.subdivisions * this.context.dx;
      for (let j = 1; j < this.notation.subdivisions; ++j) {
        const dx = j * this.context.dx
        this.root.appendChild(svg.rect({
          x: x + dx,
          y: 0,
          width: 1,
          height: height,
          fill: "#555",
        }));
      }
    }

    for (let i = 0; i < this.notation.lines; ++i) {
      const y = i * this.context.dy;
      this.root.appendChild(svg.rect({
        x: 0,
        y: y,
        width: width,
        height: 1,
        fill: i % 2 == 0 ? "#888" : "#555",
      }));
    }

    for (let i = 0; i < this.notation.beats; ++i) {
      const x = i * this.notation.subdivisions * this.context.dx;
      this.root.appendChild(svg.rect({
        x: x,
        y: 0,
        width: i == 0 ? 2 : 1,
        height: height,
        fill: i == 0 ? "white" : "#AAA",
      }));
    }

    for (let i = 0; i < this.notation.beats * this.notation.subdivisions; ++i) {
      for (let j = 0; j < this.notation.lines; ++j) {
        const note = this.notes[i][j];
        this.root.appendChild(note.root);
        note.root.setAttribute("transform", `translate(${i * this.context.dx + 1}, ${j * this.context.dy})`);
      }
    }
  }

  public dump(): any {
    return {
      notation: this.notation.dump(),
    };
  }

  public load(data: any): void {
    this.notation.load(data.notation);
  }
}
