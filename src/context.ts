export class Context {
  public dx: number = 40;
  public dy: number = 30;

  public pad(): number {
    return Math.min(this.dx, this.dy);
  }
}

export class Notation {
  public lines: number;
  public beats: number;
  public subdivisions: number;

  constructor(lines: number = 5, beats: number = 4, subdivisions: number = 2) {
    this.lines = lines;
    this.beats = beats;
    this.subdivisions = subdivisions;
  }

  public dump(): any {
    return {
      lines: this.lines,
      beats: this.beats,
      subdivisions: this.subdivisions,
    };
  }

  public load(data: any) {
    this.lines = data.lines;
    this.beats = data.beats;
    this.subdivisions = data.subdivisions;
  }

  public copy(): Notation {
    return new Notation(this.lines, this.beats, this.subdivisions);
  }
}
