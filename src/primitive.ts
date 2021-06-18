export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) {
    return 0;
  } else if (a === b) {
    return a;
  } else {
    return (a * b) / gcd(a, b);
  }
}

export function gcd(a: number, b: number): number {
  if (a < 1 || b < 1) {
    return 0;
  } else {
    let remainder = 0;
    do {
      remainder = a % b;
      a = b;
      b = remainder;
    } while (b != 0);
    return a;
  }
}

export function reduce(a: number, b: number): [number, number] {
  const divisor = gcd(a, b);
  return [a / divisor, b / divisor];
}

export class Position {
  public readonly index: number;
  public readonly subdivision: number;

  public constructor(index: number, subdivision: number) {
    [this.index, this.subdivision] = reduce(index, subdivision);
  }

  public plus(duration: Duration): Position {
    const subdivision = lcm(this.subdivision, duration.subdivision);
    const index = this.index * subdivision / this.subdivision + duration.count * subdivision / duration.subdivision;
    return new Position(index, subdivision);
  }
}

export class Duration {
  public readonly count: number;
  public readonly subdivision: number;

  public constructor(count: number, subdivision: number) {
    [this.count, this.subdivision] = reduce(count, subdivision);
  }
}

export class Range {
  public readonly start: Position;
  public readonly duration: Duration;

  public constructor(start: Position, duration: Duration) {
    this.start = start;
    this.duration = duration;
  }

  public static between(a: Position, b: Position) {
    const subdivision = lcm(a.subdivision, b.subdivision);
    const count = b.index * subdivision / b.subdivision - a.index * subdivision / a.subdivision;
    return new Range(a, new Duration(count, subdivision));
  }
}
