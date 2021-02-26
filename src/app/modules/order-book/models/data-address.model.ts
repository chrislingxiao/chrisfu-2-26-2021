export class DataAddress {
  constructor(init: DataAddress) {
    this.selectedSize = init.selectedSize;
    this.bids = init.bids;
    this.asks = init.asks;
  }

  public selectedSize: number;
  public bids: [number, number][];
  public asks: [number, number][];
}
