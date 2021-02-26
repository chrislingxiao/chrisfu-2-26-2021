import { DoWork, ObservableWorker } from 'observable-webworker';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retryWhen, switchMap, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SubscriptionMessage, RealTimeOrder } from '../models';

export const WS_ENDPOINT = environment.wsEndpoint;
const RECONNECT_INTERVAL = 3000;

@ObservableWorker()
export class OrderBookWorker implements DoWork<SubscriptionMessage, RealTimeOrder> {
  private connection$: WebSocketSubject<any>;

  public work(input$: Observable<SubscriptionMessage | string>): Observable<RealTimeOrder> {
    input$.pipe(distinctUntilChanged()).subscribe((message) => {
      if (typeof message === 'string' && message === 'disconnect') {
        this.close();
      } else {
        this.sendMessage(message as SubscriptionMessage);
      }
    });

    return this.connect();
  }

  private connect(): Observable<RealTimeOrder> {
    return of(WS_ENDPOINT).pipe(
      switchMap((wsUrl) => {
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket({
            url: wsUrl,
            closeObserver: {
              next: () => {
                console.log('[Error-SocketService]: could not connect to the service');
              },
            },
          });
          return this.connection$;
        }
      }),
      retryWhen((errors) => errors.pipe(delay(RECONNECT_INTERVAL), take(5)))
    );
  }

  private sendMessage(msg: SubscriptionMessage) {
    this.connection$.next(msg);
  }

  private close() {
    this.connection$.complete();
    this.connection$ = null;
  }
}
