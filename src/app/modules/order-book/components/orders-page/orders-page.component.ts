import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { isNil } from 'lodash-es';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SubscriptionMessage, Level } from '../../models';
import { OrderBookService } from '../../services';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();

  constructor(private orderBookService: OrderBookService) {}

  public bids$ = new BehaviorSubject<Level[]>([]);
  public asks$ = new BehaviorSubject<Level[]>([]);

  public ngOnInit(): void {
    this.subscribeOrders();

    this.orderBookService.sendMessage(
      new SubscriptionMessage({
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: ['PI_XBTUSD'],
      })
    );
  }

  public ngOnDestroy(): void {
    this.orderBookService.closeConnection();

    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private subscribeOrders(): void {
    this.orderBookService
      .connect()
      .pipe(
        filter((messages) => !isNil(messages)),
        takeUntil(this.destroyed$)
      )
      .subscribe((messages) => {
        this.updateBids(messages.bids);
        this.updateAsks(messages.asks);
      });
  }

  private updateBids(newBids: [number, number][]) {
    console.log(newBids);
    const currentBids = this.bids$.value;
  }

  private updateAsks(newAsks: [number, number][]) {
    const currentBids = this.bids$.value;
  }
}
