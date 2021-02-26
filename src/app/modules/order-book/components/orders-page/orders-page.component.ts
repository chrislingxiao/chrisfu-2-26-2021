import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { isNil } from 'lodash-es';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SubscriptionMessage, Level, LevelView } from '../../models';
import { OrderBookService } from '../../services';
import { BinTree, RBTree } from 'bintrees';
import * as numeral from 'numeral';
import { ColumnDefinition } from '@app/shared/components/item-table/models/column-definition.model';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent implements OnInit, OnDestroy {
  private static readonly PRICE_FORMAT = '$0,0.00';
  private static readonly GENERIC_FORMAT = '0,0';

  private readonly destroyed$ = new Subject();

  private readonly bidTree = new RBTree((a: Level, b: Level) => {
    return b.price - a.price;
  });

  private readonly askTree = new RBTree((a: Level, b: Level) => {
    return a.price - b.price;
  });

  private readonly bidTableColumnsDefinitions = [
    new ColumnDefinition({ header: 'Total', name: 'total' }),
    new ColumnDefinition({ header: 'Size', name: 'size' }),
    new ColumnDefinition({ header: 'Price', name: 'price' }),
  ];

  private readonly askTableColumnsDefinitions = this.bidTableColumnsDefinitions.reverse();

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
        filter((messages) => !isNil(messages) && !isNil(messages.bids) && !isNil(messages.bids)),
        takeUntil(this.destroyed$)
      )
      .subscribe((messages) => {
        this.updateBids(messages.bids);
        this.updateAsks(messages.asks);
      });
  }

  private updateBids(newBids: [number, number][]): void {
    newBids.forEach((bid) => {
      const level = new Level({
        price: bid[0],
        size: bid[1],
        total: bid[1],
      });

      this.addLevel('bid', level);
    });

    this.updateOrdersForView('bid');
  }

  private updateAsks(newAsks: [number, number][]): void {
    newAsks.forEach((ask) => {
      const level = new Level({
        price: ask[0],
        size: ask[1],
        total: ask[1],
      });

      this.addLevel('ask', level);
    });

    this.updateOrdersForView('ask');
  }

  private addLevel(side: 'bid' | 'ask', level: Level): void {
    const tree = this.getTree(side);
    let node = tree.find({ price: level.price });

    if (level.size === 0 && !isNil(node)) {
      tree.remove(node);
    } else if (isNil(node)) {
      node = { ...level };
      tree.insert(node);
    } else if (!isNil(node)) {
      node = {
        ...node,
        ...level,
      };
    }
  }

  private getTree(side: 'bid' | 'ask'): BinTree<Level> {
    if (side === 'bid') {
      return this.bidTree;
    }

    return this.askTree;
  }

  private updateOrdersForView(side: 'bid' | 'ask') {
    const tree = this.getTree(side);
    const it = tree.iterator();
    const nodeArr = [];
    let currItem: Level = null;
    let prevItem: Level = null;

    while (!isNil((currItem = it.next()))) {
      const prevTotal = isNil(prevItem) ? 0 : prevItem.total;

      currItem.total = currItem.size + prevTotal;

      nodeArr.push(
        new LevelView({
          price: numeral(currItem.price).format(OrdersPageComponent.PRICE_FORMAT),
          size: numeral(currItem.size).format(OrdersPageComponent.GENERIC_FORMAT),
          total: numeral(currItem.total).format(OrdersPageComponent.GENERIC_FORMAT),
        })
      );
      prevItem = currItem;
    }

    if (side === 'bid') {
      this.bids$.next(nodeArr);
    } else {
      this.asks$.next(nodeArr);
    }
  }
}
