import {Section} from "./section";
import {Context, Notation} from "./context";
import {Note} from "./note";

function compress(data: any): string {
  return btoa(JSON.stringify(data));
}

function decompress(compressed: string): any {
  return JSON.parse(atob(compressed));
}

export class SheetTools {
  public readonly sheet: Sheet;
  public readonly element: HTMLDivElement;
  public readonly copyBlobElement: HTMLButtonElement;
  public readonly pasteBlobElement: HTMLButtonElement;
  public readonly addSectionElement: HTMLButtonElement;
  public readonly clearElement: HTMLButtonElement;

  public constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.element = document.createElement("div");
    this.element.classList.add("sheet-tools");
    this.element.appendChild(this.copyBlobElement = document.createElement("button"));
    this.copyBlobElement.innerText = "Copy blob";
    this.element.appendChild(this.pasteBlobElement = document.createElement("button"));
    this.pasteBlobElement.innerText = "Paste blob";
    this.element.appendChild(this.addSectionElement = document.createElement("button"));
    this.addSectionElement.innerText = "Add section";
    this.element.appendChild(this.clearElement = document.createElement("button"));
    this.clearElement.innerText = "Clear";
    this.clearElement.classList.add("accent");
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
    this.tools.copyBlobElement.addEventListener("click", () => {
      navigator.clipboard.writeText(compress(this.dump()))
        .then(() => console.log("Wrote to clipboard!"))
    });
    this.tools.pasteBlobElement.addEventListener("click", () => {
      navigator.clipboard.readText().then((data: string) => {
        try {
          this.load(decompress(data));
        } catch (e) {
          console.error("Invalid blob!");
          throw e;
        }
        console.log("Read from clipboard!");
      })
    });
    this.tools.addSectionElement.addEventListener("click", () => this.push());
    this.tools.clearElement.addEventListener("click", () => this.clear());
    document.addEventListener("keypress", (event: KeyboardEvent) => {
      if (event.target === document.body) {
        Note.hover?.onkeypress(event);
      }
    });
  }

  public update(values: {notation?: Notation}): void {
    if (values.notation) {
      for (const section of this.sections) {
        if (section.notation.equalTo(this.notation)) {
          section.update({notation: values.notation});
        }
      }
      this.notation.update(values.notation);
    }
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
    this.notation.load(data.notation);
    data.sections.forEach((sectionData: any) => this.push().load(sectionData));
  }

  public push(): Section {
    const section = new Section(this);
    this.sections.push(section);
    this.sectionsElement.appendChild(section.element);
    return section;
  }
}
