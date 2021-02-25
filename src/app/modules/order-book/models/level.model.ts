export class Level {
  constructor(init: Level) {
    this.price = init.price;
    this.size = init.size;
    this.total = init.total;
  }

  public price: number;
  public size: number;
  public total: number;
}