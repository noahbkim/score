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

export interface StandardBarOptions {
  first: boolean;
  last: boolean;
}

export class StandardBar extends Bar {
  public render(context: Context, line: HorizontalLine, options?: Partial<StandardBarOptions>): BarArtifact {
    let top = line.y - (context.unit + 1) * 2 - 0.5;
    for (let i = 0, y = top; i < 5; ++i, y += context.unit + 1) {
      context.target.appendChild(svg.line({
        x1: line.left,
        y1: y,
        x2: line.right,
        y2: y,
        stroke: 'black'
      }));
    }
    const height = 4 * context.unit + 5;

    let first = line.left;
    if (options?.first) {
      context.target.appendChild(svg.rect({
        x: first,
        y: top,
        width: 3,
        height: height - 1,
        stroke: 'black',
      }));
      first += 7;
    }
    context.target.appendChild(svg.line({
      x1: first,
      y1: top - 0.5,
      x2: first,
      y2: top - 0.5 + height,
      stroke: 'black',
    }));

    return new BarArtifact(
      line.box(height),
      new HorizontalBounds(line.left + context.unit, line.right - context.unit));
  }
}
