import {Section} from "./section";
import {Context, Notation} from "./context";

export class Sheet {
  public readonly context: Context;
  public readonly notation: Notation;
  public readonly root: HTMLDivElement;
  public readonly sections: Array<Section> = [];

  public constructor(context: Context, notation: Notation = new Notation()) {
    this.context = context;
    this.notation = notation;
    this.root = document.createElement("div");
    this.root.classList.add("sheet");
  }

  public clear(): void {
    this.sections.length = 0;
    this.root.replaceChildren();
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
    this.notation.load(data.subdivisions);
  }

  public push(): Section {
    const section = new Section(this.context, this.notation.copy());
    this.sections.push(section);
    this.root.appendChild(section.root);
    return section;
  }
}
