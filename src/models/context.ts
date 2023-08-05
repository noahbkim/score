export class Context {
  public dx: number
  public dy: number

  public get pad(): number {
    return Math.min(this.dx, this.dy)
  }

  public constructor(dx: number, dy: number) {
    this.dx = dx
    this.dy = dy
  }
}
