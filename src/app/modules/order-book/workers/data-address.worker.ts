import { DoWork, ObservableWorker } from 'observable-webworker';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BinTree, RBTree } from 'bintrees';
import { isNil } from 'lodash-es';
import * as numeral from 'numeral';
import { LevelView, Level, DataAddress, DataAddressResponse } from '../models';

@ObservableWorker()
export class OrderBookWorker implements DoWork<DataAddress, DataAddressResponse> {
  private readonly PRICE_FORMAT = '$0,0.00';
  private readonly GENERIC_FORMAT = '0,0';

  private readonly bidTree = new RBTree((a: Level, b: Level) => {
    return b.price - a.price;
  });

  private readonly askTree = new RBTree((a: Level, b: Level) => {
    return a.price - b.price;
  });

  private selectedSize = 15;

  public work(data$: Observable<DataAddress>): Observable<DataAddressResponse> {
    return data$.pipe(
      filter((data) => !isNil(data)),
      distinctUntilChanged(),
      map((data) => {
        this.selectedSize = data.selectedSize;

        return {
          updatedBids: this.updateBids(data.bids),
          updatedAsks: this.updateAsks(data.asks),
        };
      })
    );
  }

  private updateBids(newBids: [number, number][]): LevelView[] {
    newBids.forEach((bid) => {
      const level = new Level({
        price: bid[0],
        size: bid[1],
        total: bid[1],
      });

      this.addLevel('bid', level);
    });

    return this.updateOrdersForView('bid');
  }

  private updateAsks(newAsks: [number, number][]): LevelView[] {
    newAsks.forEach((ask) => {
      const level = new Level({
        price: ask[0],
        size: ask[1],
        total: ask[1],
      });

      this.addLevel('ask', level);
    });

    return this.updateOrdersForView('ask');
  }

  private addLevel(side: 'bid' | 'ask', level: Level): void {
    const tree = this.getTree(side);
    let node = tree.find({ price: level.price });

    if (isNil(node) && level.size > 0) {
      node = { ...level };
      tree.insert(node);
    } else if (!isNil(node)) {
      if (level.size <= 0) {
        tree.remove(node);
      } else {
        node = {
          ...node,
          ...level,
        };
      }
    }
  }

  private getTree(side: 'bid' | 'ask'): BinTree<Level> {
    if (side === 'bid') {
      return this.bidTree;
    }

    return this.askTree;
  }

  private updateOrdersForView(side: 'bid' | 'ask'): LevelView[] {
    const tree = this.getTree(side);
    const it = tree.iterator();
    const nodeArr = [];
    let currItem: Level = null;
    let prevItem: Level = null;
    let count = 0;

    while (!isNil((currItem = it.next())) && count++ < this.selectedSize) {
      const prevTotal = isNil(prevItem) ? 0 : prevItem.total;

      currItem.total = currItem.size + prevTotal;

      nodeArr.push(
        new LevelView({
          price: numeral(currItem.price).format(this.PRICE_FORMAT),
          size: numeral(currItem.size).format(this.GENERIC_FORMAT),
          total: numeral(currItem.total).format(this.GENERIC_FORMAT),
        })
      );
      prevItem = currItem;
    }

    return nodeArr;
  }
}
