import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash-es';

import { SubscriptionMessage, LevelView, DataAddress } from '../../models';
import { OrderBookService } from '../../services';
import { ColumnDefinition, ItemTableOptions } from '@app/shared/components/item-table/models';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject();

  private readonly subscribeMessage$ = new BehaviorSubject<SubscriptionMessage | string>(null);

  private readonly dataForAddressing$ = new BehaviorSubject<DataAddress>(null);

  private readonly bidTableColumnsDefinitions = [
    new ColumnDefinition({ header: 'Total', name: 'total' }),
    new ColumnDefinition({ header: 'Size', name: 'size' }),
    new ColumnDefinition({ header: 'Price', name: 'price' }),
  ];

  private readonly askTableColumnsDefinitions = this.bidTableColumnsDefinitions.slice().reverse();

  constructor(private router: Router, private orderBookService: OrderBookService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.resetConnection();
      }
    });
  }

  public readonly orderListSizeOptions = [
    {
      displayText: '10 rows',
      value: 10,
    },
    {
      displayText: '15 rows',
      value: 15,
    },
    {
      displayText: '30 rows',
      value: 30,
    },
  ];

  public bids$ = new BehaviorSubject<LevelView[]>([]);
  public asks$ = new BehaviorSubject<LevelView[]>([]);

  public bidsTableOptions: ItemTableOptions = {
    columnDefinitions: this.bidTableColumnsDefinitions,
    data$: this.bids$,
    trackBy: (item: LevelView) => item.price,
  };

  public asksTableOptions: ItemTableOptions = {
    columnDefinitions: this.askTableColumnsDefinitions,
    data$: this.asks$,
    trackBy: (item: LevelView) => item.price,
  };

  public selectedSize = this.orderListSizeOptions[0].value;

  @HostListener('window:beforeunload', ['$event'])
  public beforeUnloadHandler(event): void {
    this.resetConnection();
  }

  public ngOnInit(): void {
    this.subscribeOrders();

    this.subscribeDataAddress();

    this.subscribeMessage$.next(
      new SubscriptionMessage({
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: ['PI_XBTUSD'],
      })
    );
  }

  public ngOnDestroy(): void {
    this.resetConnection();
  }

  private subscribeOrders(): void {
    this.orderBookService
      .connect(this.subscribeMessage$ as Observable<SubscriptionMessage>)
      .pipe(
        filter((messages) => !isNil(messages?.bids) && !isNil(messages?.bids)),
        takeUntil(this.destroyed$)
      )
      .subscribe((messages) => {
        this.dataForAddressing$.next(
          new DataAddress({
            selectedSize: this.selectedSize,
            bids: messages.bids,
            asks: messages.asks,
          })
        );
      });
  }

  public subscribeDataAddress(): void {
    this.orderBookService
      .addressData(this.dataForAddressing$)
      .pipe(
        filter(
          (addressedData) =>
            !isNil(addressedData?.updatedBids) && !isNil(addressedData?.updatedAsks)
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe((addressedData) => {
        this.updateBids(addressedData.updatedBids);
        this.updateAsks(addressedData.updatedAsks);
      });
  }

  private updateBids(updatedBids: LevelView[]): void {
    this.bids$.next(updatedBids);
  }

  private updateAsks(updatedAsks: LevelView[]): void {
    this.asks$.next(updatedAsks);
  }

  private resetConnection(): void {
    this.subscribeMessage$.next('disconnect');
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
