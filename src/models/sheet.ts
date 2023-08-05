export class Note {
  public bar: Bar;
  public x: number;
  public y: number;
  public symbol: number;

  constructor(bar: Bar) {
    this.bar = bar;
    this.x = 0;
    this.y = 0;
    this.symbol = 0;
  }

  public dump(): any {
    return { x: this.x, y: this.y, symbol: this.symbol };
  }

  public load(data: any): void {
    this.x = data.x;
    this.y = data.y;
    this.symbol = data.symbol;
  }
}

export class Signature {
  public beats: number;
  public subdivisions: number;

  public get count(): number {
    return this.beats * this.subdivisions;
  }

  public constructor(beats: number, subdivisions: number) {
    this.beats = beats;
    this.subdivisions = subdivisions;
  }

  public dump(): any {
    return { beats: this.beats, subdivisions: this.subdivisions };
  }

  public load(data: any): void {
    this.beats = data.beats;
    this.subdivisions = data.subdivisions;
  }
}

export class Bar {
  public section: Section;
  public signature: Signature;
  public readonly notes: Array<Note>;

  public get lines(): number {
    return this.section.lines;
  }

  constructor(section: Section) {
    this.section = section;
    this.signature = section.signature;
    this.notes = [];
  }

  public dump(): any {
    return {
      signature: this.signature.dump(),
      notes: this.notes.map((note: Note) => note.dump())
    };
  }

  public load(data: any): void {
    this.signature.load(data.signature);
    this.notes.length = 0;
    data.notes.forEach((noteData: any) => this.push().load(noteData));
  }

  public push(): Note {
    const note = new Note(this);
    this.notes.push(note);
    return note;
  }
}

export class Section {
  public sheet: Sheet;
  public signature: Signature;
  public readonly bars: Array<Bar>;
  public name: string;

  public get lines(): number {
    return this.sheet.lines;
  }

  public constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.signature = sheet.signature;
    this.bars = [];
    this.name = 'Section';
  }

  public dump(): any {
    return {
      signature: this.signature.dump(),
      bars: this.bars.map((bar: Bar) => bar.dump()),
      name: this.name
    };
  }

  public load(data: any): void {
    this.signature.load(data.signature);
    this.bars.length = 0;
    data.bars.forEach((barData: any) => this.push().load(barData));
    this.name = data.name;
  }

  public push(): Bar {
    const bar = new Bar(this);
    this.bars.push(bar);
    return bar;
  }
}

export class Sheet {
  public signature: Signature;
  public lines: number;
  public readonly sections: Array<Section>;

  public constructor(signature: Signature, lines: number = 5) {
    this.signature = signature;
    this.lines = lines;
    this.sections = [];
  }

  public dump(): any {
    return {
      signature: this.signature.dump(),
      sections: this.sections.map((section: Section) => section.dump())
    };
  }

  public load(data: any): void {
    this.signature.load(data.notation);
    this.sections.length = 0;
    data.sections.forEach((sectionData: any) => this.push().load(sectionData));
  }

  public push(): Section {
    const section = new Section(this);
    this.sections.push(section);
    return section;
  }
}
