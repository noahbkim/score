import {Position, Duration, Range} from './primitive';

export class Score {
  public readonly bars: Array<Bar>;
  public readonly notes: Array<Note>;
}

export class Bar {
  public readonly range: Range;
}

export class Section {
  public readonly range: Range;
}

export class Figure {}

export class Note {
  public readonly position: Position;
  public readonly symbol: Symbol;
  public readonly spacing: number;
}
