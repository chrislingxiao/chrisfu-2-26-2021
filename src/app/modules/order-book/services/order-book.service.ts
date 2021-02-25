import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retryWhen, switchMap, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubscriptionMessage, RealTimeOrder } from '../models';

export const WS_ENDPOINT = environment.wsEndpoint;
const RECONNECT_INTERVAL = 3000;

@Injectable({
  providedIn: 'root',
})
export class OrderBookService {
  private connection$: WebSocketSubject<any>;

  constructor() {}

  public connect(): Observable<RealTimeOrder> {
    return of(WS_ENDPOINT).pipe(
      switchMap((wsUrl) => {
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket(wsUrl);
          return this.connection$;
        }
      }),
      retryWhen((errors) => errors.pipe(delay(RECONNECT_INTERVAL)))
    );
  }

  public closeConnection() {
    this.connection$.complete();
    this.connection$ = null;
  }

  public sendMessage(msg: SubscriptionMessage) {
    this.connection$.next(msg);
  }
}
