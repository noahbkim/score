import {Context, Notation} from "./context";
import {Bar} from "./bar";

export class Section {
  private readonly context: Context;
  private readonly notation: Notation;
  public readonly root: HTMLDivElement;

  public readonly bars: Array<Bar> = [];
  public beats: number = 4;
  public subdivisions: number = 2;

  public constructor(context: Context, notation: Notation) {
    this.context = context;
    this.notation = notation;
    this.root = document.createElement("div");
    this.root.classList.add("section");
  }

  public dump(): any {
    return {
      bars: this.bars.map((bar: Bar) => bar.dump()),
      beats: this.beats,
      subdivisions: this.subdivisions,
    }
  }

  public load(data: any): void {
    data.bars.forEach((barData: any) => this.push().load(barData));
    this.beats = data.beats;
    this.subdivisions = data.subdivisions;
  }

  public push(): Bar {
    const bar = new Bar(this.context, this.notation.copy());
    this.bars.push(bar);
    this.root.appendChild(bar.root);
    return bar;
  }
}