export enum x {
  1 = 1
}

export default class Test {
  t: number = 0

  constructor() {
    this.t = 1
  }

  public getT(): number {
    return this.t
  }
}
