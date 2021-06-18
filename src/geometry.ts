export class Point {
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public translate(x: number, y: number): Point {
    return new Point(this.x + x, this.y + y);
  }
}

export class CornerBox {
  public readonly origin: Point;
  public readonly width: number;
  public readonly height: number;

  public constructor(origin: Point, width: number, height: number) {
    this.origin = origin;
    this.width = width;
    this.height = height;
  }
}

export class Line {
  public readonly start: Point;
  public readonly end: Point;
}

export class HorizontalBounds {
  public readonly left: number;
  public readonly right: number;

  public constructor(left: number, right: number) {
    this.left = left;
    this.right = right;
  }

  public width(): number {
    return this.right - this.left;
  }
}

export class HorizontalLine extends HorizontalBounds {
  public readonly y: number;

  public constructor(left: number, right: number, y: number) {
    super(left, right);
    this.y = y;
  }

  public box(height: number): HorizontalBox {
    return new HorizontalBox(this.left, this.right, this.y, height);
  }
}

export class HorizontalBox extends HorizontalLine {
  public readonly height: number;

  public constructor(left: number, right: number, y: number, height: number) {
    super(left, right, y);
    this.height = height;
  }
}
