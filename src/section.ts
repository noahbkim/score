import {Context, Notation} from "./context";
import {Bar} from "./bar";

export class BarTools {
  public readonly section: Section;
  public readonly element: HTMLDivElement;
  public readonly addElement: HTMLButtonElement;
  public readonly removeElement: HTMLButtonElement;

  public constructor(section: Section) {
    this.section = section;
    this.element = document.createElement("div");
    this.element.classList.add("bar-tools");
    this.element.appendChild(this.addElement = document.createElement("button"));
    this.addElement.innerText = "+";
    this.element.appendChild(this.removeElement = document.createElement("button"));
    this.removeElement.innerText = "-";
    this.clear();
  }

  public clear(): void {
    this.element.style.marginLeft = `${this.section.context.pad()}px`;
    this.element.style.height = `${this.section.context.dy * (this.section.notation.lines - 1)}px`;
  }
}

export class SectionTools {
  public readonly section: Section;
  public readonly element: HTMLDivElement;
  public readonly addBeforeElement: HTMLButtonElement;
  public readonly addAfterElement: HTMLButtonElement;
  public readonly duplicateElement: HTMLButtonElement;

  public constructor(section: Section) {
    this.section = section;
    this.element = document.createElement("div");
    this.element.classList.add("section-tools");
    this.element.appendChild(this.addBeforeElement = document.createElement("button"));
    this.addBeforeElement.innerText = "Add before";
    this.element.appendChild(this.addAfterElement = document.createElement("button"));
    this.addAfterElement.innerText = "Add after";
    this.element.appendChild(this.duplicateElement = document.createElement("button"));
    this.duplicateElement.innerText = "Duplicate";
  }
}

export class Section {
  public readonly context: Context;
  public readonly notation: Notation;
  public readonly element: HTMLDivElement;
  public readonly barsElement: HTMLDivElement;
  public readonly bars: Array<Bar> = [];
  public readonly barTools: BarTools;
  public readonly tools: SectionTools;

  public constructor(context: Context, notation: Notation) {
    this.context = context;
    this.notation = notation;
    this.element = document.createElement("div");
    this.element.classList.add("section");
    this.element.appendChild(this.barsElement = document.createElement("div"));
    this.barsElement.classList.add("bars");
    this.barTools = new BarTools(this);
    this.barsElement.appendChild(this.barTools.element);
    this.barTools.addElement.addEventListener("click", () => this.push());
    this.barTools.removeElement.addEventListener("click", () => this.pop());
    this.tools = new SectionTools(this);
    this.element.appendChild(this.tools.element);
  }

  public dump(): any {
    return {
      bars: this.bars.map((bar: Bar) => bar.dump()),
      notation: this.notation.dump(),
    }
  }

  public load(data: any): void {
    data.bars.forEach((barData: any) => this.push().load(barData));
    this.notation.load(data.notation);
  }

  public push(): Bar {
    const bar = new Bar(this.context, this.notation.copy());
    this.bars.push(bar);
    this.barsElement.insertBefore(bar.element, this.barTools.element);
    return bar;
  }

  public pop(): Bar {
    const bar = this.bars.pop();
    this.barsElement.removeChild(bar.element);
    return bar;
  }
}