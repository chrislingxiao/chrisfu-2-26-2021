import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'order-book',
    pathMatch: 'full',
  },
  {
    path: 'order-book',
    loadChildren: () =>
      import('./modules/order-book/order-book.module').then((m) => m.OrderBookModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
