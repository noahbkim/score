import {Score} from "./notation";
import {StandardBar} from "./bar";
import {HorizontalLine, Point} from "./geometry";
import {QuarterNote} from "./note";

interface Options {
  uniform: boolean;
  wrap: boolean;
}

export class Context {
  public readonly target: SVGElement;
  public readonly options: Options;
  public readonly unit: number;

  public constructor(target: SVGElement, options: Options, unit: number) {
    this.target = target;
    this.options = options;
    this.unit = unit;
  }
}

export class Renderer {
  private target: SVGElement;
  private readonly options: Options;

  public constructor(t: SVGElement, o: Options) {
    this.target = t;
    this.options = o;
  }

  public render(score: Score): void {
    console.log('rendering');
    const unit = 11;
    const context = new Context(this.target, this.options, unit);
    const bar = new StandardBar();
    bar.render(context, new HorizontalLine(10, 210, 50), {first: true});
    const note = new QuarterNote();
    note.render(context, new Point(40, 55.5), {fill: 'red'})
  }

  public clear(): void {
    while (this.target.firstChild !== null) {
      this.target.removeChild(this.target.firstChild);
    }
  }
}
