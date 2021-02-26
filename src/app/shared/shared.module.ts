import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ItemTableComponent } from './components';
import { MoneyFormatPipe } from './pipes';
import { NgZorroModule } from './ng-zorro.moddule';

const COMPONENTS = [ItemTableComponent];

const PIPES = [MoneyFormatPipe];

@NgModule({
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, NgZorroModule],
  declarations: [...COMPONENTS, ...PIPES, ItemTableComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, ...COMPONENTS, ...PIPES],
  providers: [CurrencyPipe, DecimalPipe],
})
export class SharedModule {}
