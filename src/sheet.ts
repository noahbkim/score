import {Section} from "./section";
import {Context, Notation} from "./context";
import {Note} from "./note";

export class SheetTools {
  public readonly sheet: Sheet;
  public readonly element: HTMLDivElement;
  public readonly addSectionElement: HTMLButtonElement;

  public constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.element = document.createElement("div");
    this.element.classList.add("sheet-tools");
    this.element.appendChild(this.addSectionElement = document.createElement("button"));
    this.addSectionElement.innerText = "Add section";
  }
}

export class Sheet {
  public readonly context: Context;
  public readonly notation: Notation;
  public readonly element: HTMLDivElement;
  public readonly sectionsElement: HTMLDivElement;
  public readonly sections: Array<Section> = [];
  public readonly tools: SheetTools;

  public constructor(context: Context, notation: Notation = new Notation()) {
    this.context = context;
    this.notation = notation;
    this.element = document.createElement("div");
    this.element.classList.add("sheet");
    this.element.appendChild(this.sectionsElement = document.createElement("div"));
    this.sectionsElement.classList.add("sections");
    this.tools = new SheetTools(this);
    this.element.appendChild(this.tools.element);
    this.tools.addSectionElement.addEventListener("click", () => this.push());

    document.addEventListener("keypress", (event: KeyboardEvent) => {
      if (event.target === document.body) {
        Note.hover?.onkeypress(event);
      }
    });
  }

  public clear(): void {
    this.sections.length = 0;
    this.sectionsElement.replaceChildren();
  }

  public dump(): any {
    return {
      sections: this.sections.map((section: Section) => section.dump()),
      notation: this.notation.dump(),
    };
  }

  public load(data: any): void {
    this.clear();
    data.sections.forEach((sectionData: any) => this.push().load(sectionData));
    this.notation.load(data.notation);
  }

  public push(): Section {
    const section = new Section(this.context, this.notation.copy());
    this.sections.push(section);
    this.sectionsElement.appendChild(section.element);
    return section;
  }
}
