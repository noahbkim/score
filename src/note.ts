import * as svg from './svg';
import {Context} from "./renderer";
import {Point} from "./geometry";

export class NoteConnectors {
  public readonly left: {top: Point, bottom: Point};
  public readonly right: {top: Point, bottom: Point};

  public constructor(lt: Point, lb: Point, rt: Point, rb: Point) {
    this.left = {top: lt, bottom: lb};
    this.right = {top: rt, bottom: rb};
  }
}

export class NoteArtifact {
  public readonly center: Point;
  public readonly connectors: NoteConnectors;

  public constructor(center: Point, connectors: NoteConnectors) {
    this.center = center;
    this.connectors = connectors;
  }
}

export abstract class Note {
  public abstract render(context: Context, center: Point, attributes?: Record<string, any>): NoteArtifact;
}

export class QuarterNote extends Note {
  public render(context: Context, center: Point, attributes?: Record<string, any>): NoteArtifact {
    const w = 0.75 * context.unit;
    const h = 0.45 * context.unit;
    const angle = 15;
    console.log(center);
    context.target.appendChild(svg.ellipse({
      cx: center.x,
      cy: center.y,
      rx: w,
      ry: h,
      transform: `rotate(-${angle}, ${center.x}, ${center.y})`,
      ...attributes
    }));
    const f = Math.cos(angle / 180 * Math.PI);
    const l = center.translate(-w * f, h * f);
    const r = center.translate(w * f,  h * f);
    return new NoteArtifact(center, new NoteConnectors(l, l, r, r));
  }
}
