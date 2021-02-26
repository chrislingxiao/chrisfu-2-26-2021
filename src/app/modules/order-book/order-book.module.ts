import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { OrderBookRoutingModule } from './order-book-routing.module';
import { OrdersPageComponent } from './components';

@NgModule({
  declarations: [OrdersPageComponent],
  imports: [SharedModule, CommonModule, OrderBookRoutingModule],
})
export class OrderBookModule {}
