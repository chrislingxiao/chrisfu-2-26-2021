export class RealTimeOrder {
  constructor(init: Partial<RealTimeOrder> = {}) {
    this.feed = init.feed;
    this.product_id = init.product_id;
    this.bids = init.bids || [];
    this.bids = init.asks || [];
  }

  public feed: string;
  public product_id: string;
  public bids: [number, number][];
  public asks: [number, number][];
}
