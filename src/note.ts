import {Context} from "./context";
import * as svg from './svg';

const SYMBOLS: Array<(context: Context) => SVGElement | null> = [
  // No symbol
  () => null,
  // Circle
  (context: Context) => svg.circle({
    cx: 0,
    cy: 0,
    r: context.pad() * 0.2,
    fill: "transparent",
    stroke: "white",
    "stroke-width": "2px",
  }),
  // Square
  (context: Context) => svg.rect({
    x: -context.pad() * 0.2,
    y: -context.pad() * 0.2,
    width: context.pad() * 0.4,
    height: context.pad() * 0.4,
    fill: "transparent",
    stroke: "white",
    "stroke-width": "2px",
  }),
  // Right
  (context: Context) => svg.line({
    x1: -context.pad() * 0.2,
    y1: -context.pad() * 0.2,
    x2: context.pad() * 0.2,
    y2: context.pad() * 0.2,
    stroke: "white",
    "stroke-width": "4px",
  }),
  // Left
  (context: Context) => svg.line({
    x1: -context.pad() * 0.2,
    y1: context.pad() * 0.2,
    x2: context.pad() * 0.2,
    y2: -context.pad() * 0.2,
    stroke: "white",
    "stroke-width": "4px",
  }),
  // Diamond (placeholder)
  (context: Context) => svg.circle({
    cx: 0,
    cy: 0,
    r: context.pad() * 0.2,
    fill: "white",
    stroke: "white",
    "stroke-width": "2px",
  }),
];

export class Note {
  public readonly context: Context;
  public readonly root: SVGGElement;
  private readonly hoverElement: SVGElement;
  public symbol: number;
  private symbolElement: SVGElement | null = null;
  public static hover: Note | null = null;

  constructor(context: Context) {
    this.context = context;
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.hoverElement = svg.circle({cx: 0, cy: 0, r: this.context.pad() * 0.4, fill: "transparent"})
    this.hoverElement.classList.add("hover");
    this.hoverElement.addEventListener("click", this.toggle.bind(this));
    this.hoverElement.addEventListener("mouseenter", () => Note.hover = this);
    this.hoverElement.addEventListener("mouseleave", () => Note.hover = null);
    this.root.appendChild(this.hoverElement);
    this.symbol = 0;
  }

  public load(data: any): void {
    this.symbol = data.symbol;
    this.show(SYMBOLS[this.symbol](this.context));
  }

  public dump(): any {
    return {
      symbol: this.symbol,
    }
  }

  public assign(index: number): void {
    this.symbol = index;
    this.show(SYMBOLS[index](this.context));
  }

  public show(symbol: SVGElement | null): void {
    if (this.symbolElement === null) {
      this.root.insertBefore(symbol, this.root.firstChild);
    } else {
      if (symbol != null) {
        this.root.replaceChild(symbol, this.symbolElement);
      } else {
        this.root.removeChild(this.symbolElement);
      }
    }
    this.symbolElement = symbol;
  }

  public toggle(): void {
    this.assign((this.symbol + 1) % SYMBOLS.length);
  }

  public onkeypress(event: KeyboardEvent): void {
    if ("0123456789".indexOf(event.key) !== -1) {
      const index = parseInt(event.key);
      if (index < SYMBOLS.length) {
        this.assign(index);
      }
    } else if (event.key === "Backspace") {
      this.assign(0);
    }
  }
}