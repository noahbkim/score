import {Context} from "./renderer";
import {HorizontalLine, HorizontalBox, HorizontalBounds} from "./geometry";
import * as svg from './svg';

export class BarArtifact {
  public readonly box: HorizontalBox;
  public readonly safe: HorizontalBounds;

  public constructor(box: HorizontalBox, safe: HorizontalBounds) {
    this.box = box;
    this.safe = safe;
  }
}

export abstract class Bar {
  public abstract render(context: Context, line: HorizontalLine, attributes?: Record<string, any>): BarArtifact;
}

export class StandardBar extends Bar {
  public render(context: Context, line: HorizontalLine, attributes?: Record<string, any>): BarArtifact {
    let y = line.y - (context.unit + 1) * 2 - 0.5;
    for (let i = 0; i < 5; ++i, y += context.unit + 1) {
      context.target.appendChild(svg.line({
        x1: line.left,
        y1: y,
        x2: line.right,
        y2: y,
        stroke: 'black',
        ...attributes
      }));
    }
    return new BarArtifact(
      line.box(4 * context.unit + 5),
      new HorizontalBounds(line.left + context.unit, line.right - context.unit));
  }
}
