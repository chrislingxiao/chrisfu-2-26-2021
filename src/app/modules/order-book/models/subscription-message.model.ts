export class SubscriptionMessage {
  constructor(init: SubscriptionMessage) {
    this.event = init.event;
    this.feed = init.feed;
    this.product_ids = init.product_ids;
  }

  public event: string;
  public feed: string;
  public product_ids: string[];
}