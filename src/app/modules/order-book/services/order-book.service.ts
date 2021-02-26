import { Injectable } from '@angular/core';
import { fromWorker } from 'observable-webworker';
import { Observable } from 'rxjs';
import { SubscriptionMessage, RealTimeOrder, DataAddress, DataAddressResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderBookService {
  public connect(inputs$: Observable<SubscriptionMessage>): Observable<RealTimeOrder> {
    return fromWorker(
      () => new Worker('../workers/order-book.worker', { type: 'module' }),
      inputs$
    );
  }

  public addressData(data$: Observable<DataAddress>): Observable<DataAddressResponse> {
    return fromWorker(
      () => new Worker('../workers/data-address.worker', { type: 'module' }),
      data$
    );
  }
}
