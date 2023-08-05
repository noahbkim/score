import {Context, Notation} from "./context";
import {Note} from "./note";
import * as svg from './svg';
import {Section} from "./section";

export class Bar {
  private readonly context: Context;
  public readonly notation: Notation;
  public readonly element: SVGSVGElement;
  public readonly notes: Array<Array<Note>>;

  public constructor(section: Section) {
    this.context = section.context;
    this.notation = section.notation.copy();
    this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.element.classList.add("bar");
    this.element.style.marginRight = `-${2 * this.context.pad()}px`;
    this.notes = [];
    this.clear();
  }

  public draw(): void {
    this.element.replaceChildren();
    const width = this.notation.beats * this.notation.subdivisions * this.context.dx;
    const height = (this.notation.lines - 1) * this.context.dy + 1;
    const pad = this.context.pad();
    this.element.style.width = `${width + 2 * pad}px`;
    this.element.style.height = `${height + 2 * pad}px`;
    this.element.setAttribute("viewBox", `-${pad} -${pad} ${width + 2 * pad} ${height + 2 * pad}`);

    for (let i = 0; i < this.notation.beats; ++i) {
      const x = i * this.notation.subdivisions * this.context.dx;
      for (let j = 1; j < this.notation.subdivisions; ++j) {
        const dx = j * this.context.dx
        this.element.appendChild(svg.rect({
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
      this.element.appendChild(svg.rect({
        x: 0,
        y: y,
        width: width,
        height: 1,
        fill: (i == 0 || i == this.notation.lines - 1) ? "#888" : "#555",
      }));
    }

    for (let i = 0; i < this.notation.beats; ++i) {
      const x = i * this.notation.subdivisions * this.context.dx;
      this.element.appendChild(svg.rect({
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
        this.element.appendChild(note.root);
        note.root.setAttribute("transform", `translate(${i * this.context.dx + 1}, ${j * this.context.dy})`);
      }
    }
  }

  public update(values: {notation?: Notation}): void {
    if (values.notation) {
      this.notation.update(values.notation);
      this.clear(false);
    }
  }

  public clear(notes: boolean = true): void {
    const copy = [...this.notes];
    this.notes.length = 0;
    for (let i = 0; i < this.notation.beats * this.notation.subdivisions; ++i) {
      const frame = [];
      for (let j = 0; j < this.notation.lines; ++j) {
        if (!notes && i < copy.length && j < copy[i].length) {
          frame.push(copy[i][j]);
        } else {
          frame.push(new Note(this.context));
        }
      }
      this.notes.push(frame);
    }
    this.draw();
  }

  public dump(): any {
    const notes = [];
    for (let i = 0; i < this.notation.beats * this.notation.subdivisions; ++i) {
      for (let j = 0; j < this.notation.lines; ++j) {
        const note = this.notes[i][j];
        if (note.symbol != 0) {
          notes.push([i, j, note.dump()]);
        }
      }
    }
    return {
      notation: this.notation.dump(),
      notes: notes,
    };
  }

  public load(data: any): void {
    this.notation.load(data.notation);
    for (const note of data.notes) {
      const [i, j, noteData] = note;
      this.notes[i][j].load(noteData);
    }
  }
}
