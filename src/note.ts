import {Context} from "./context";
import * as svg from './svg';

export enum Symbol {
  NONE,
  LEFT_SLASH,
  RIGHT_SLASH,
  X,
  HOLLOW_CIRCLE,
  FILLED_CIRCLE,
  HOLLOW_SQUARE,
  FILLED_SQUARE,
}

export class Note {
  public readonly context: Context;
  public readonly root: SVGGElement;
  private readonly hoverElement: SVGElement;
  private symbolElement: SVGElement | null = null;
  private symbol: Symbol;

  constructor(context: Context) {
    this.context = context;
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.hoverElement = svg.circle({cx: 0, cy: 0, r: this.context.pad() * 0.4, fill: "transparent"})
    this.hoverElement.classList.add("hover");
    this.hoverElement.addEventListener("click", this.toggle.bind(this));
    this.root.appendChild(this.hoverElement);
    this.symbol = 0;
  }

  public load(data: any): void {
    this.symbol = data.symbol;
  }

  public dump(): any {
    return {
      symbol: this.symbol,
    }
  }

  public toggle(): void {
    if (this.symbolElement === null) {
      this.symbolElement = svg.circle({cx: 0, cy: 0, r: this.context.pad() * 0.3, fill: "transparent", stroke: "white"});
      this.root.insertBefore(this.symbolElement, this.root.firstChild);
    } else {
      this.root.removeChild(this.symbolElement);
      this.symbolElement = null;
    }
  }
}