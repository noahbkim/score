import {Context, Notation} from "./context";
import {Bar} from "./bar";
import {Sheet} from "./sheet";

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
  public readonly deleteElement: HTMLButtonElement;
  public readonly beatsElement: HTMLInputElement;
  public readonly subdivisionsElement: HTMLInputElement;

  public constructor(section: Section) {
    this.section = section;
    this.element = document.createElement("div");
    this.element.classList.add("section-tools");
    this.element.appendChild(this.beatsElement = document.createElement("input"));
    this.beatsElement.setAttribute("type", "number");
    this.beatsElement.style.width = "3rem";
    this.element.appendChild(this.subdivisionsElement = document.createElement("input"));
    this.subdivisionsElement.setAttribute("type", "number");
    this.subdivisionsElement.style.width = "3rem";
    this.element.appendChild(this.addBeforeElement = document.createElement("button"));
    this.addBeforeElement.innerText = "Add before";
    this.element.appendChild(this.addAfterElement = document.createElement("button"));
    this.addAfterElement.innerText = "Add after";
    this.element.appendChild(this.duplicateElement = document.createElement("button"));
    this.duplicateElement.innerText = "Duplicate";
    this.element.appendChild(this.deleteElement = document.createElement("button"));
    this.deleteElement.innerText = "Delete";
    this.deleteElement.classList.add("accent");
  }
}

export class Section {
  public readonly sheet: Sheet;
  public readonly context: Context;
  public readonly notation: Notation;
  public readonly element: HTMLDivElement;
  public readonly barsElement: HTMLDivElement;
  public readonly bars: Array<Bar> = [];
  public readonly barTools: BarTools;
  public readonly tools: SectionTools;

  public constructor(sheet: Sheet) {
    this.context = sheet.context;
    this.notation = sheet.notation.copy();
    this.element = document.createElement("div");
    this.element.classList.add("section");
    this.element.appendChild(this.barsElement = document.createElement("div"));
    this.barsElement.classList.add("bars");
    this.barTools = new BarTools(this);
    this.barsElement.appendChild(this.barTools.element);
    this.barTools.addElement.addEventListener("click", () => this.push());
    this.barTools.removeElement.addEventListener("click", () => this.pop());
    this.tools = new SectionTools(this);
    this.tools.beatsElement.value = this.notation.beats.toString();
    this.tools.subdivisionsElement.value = this.notation.subdivisions.toString();
    this.tools.beatsElement.addEventListener("change", () => {
      this.update({
        notation: new Notation(
          this.notation.lines,
          parseInt(this.tools.beatsElement.value),
          parseInt(this.tools.subdivisionsElement.value),
        ),
      });
    });
    this.tools.subdivisionsElement.addEventListener("change", () => {
      this.update({
        notation: new Notation(
          this.notation.lines,
          parseInt(this.tools.beatsElement.value),
          parseInt(this.tools.subdivisionsElement.value),
        ),
      });
    });
    this.element.appendChild(this.tools.element);
  }

  public update(values: {notation?: Notation}): void {
    if (values.notation) {
      for (const bar of this.bars) {
        if (bar.notation.equalTo(this.notation)) {
          bar.update({notation: values.notation});
        }
      }
      this.notation.update(values.notation);
      this.tools.beatsElement.value = this.notation.beats.toString();
      this.tools.subdivisionsElement.value = this.notation.subdivisions.toString();
    }
  }

  public dump(): any {
    return {
      bars: this.bars.map((bar: Bar) => bar.dump()),
      notation: this.notation.dump(),
    }
  }

  public load(data: any): void {
    this.notation.load(data.notation);
    this.tools.beatsElement.value = this.notation.beats.toString();
    this.tools.subdivisionsElement.value = this.notation.subdivisions.toString();
    data.bars.forEach((barData: any) => this.push().load(barData));
  }

  public push(): Bar {
    const bar = new Bar(this);
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