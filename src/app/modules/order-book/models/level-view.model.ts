export class LevelView {
  constructor(init: Partial<LevelView> = {}) {
    this.price = init.price;
    this.size = init.size;
    this.total = init.total;
  }

  public price: string;
  public size: string;
  public total: string;
}
