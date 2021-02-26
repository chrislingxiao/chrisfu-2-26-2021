import { Component, Input, OnInit } from '@angular/core';
import { ItemTableOptions } from './models/item-table-options.model';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.scss']
})
export class ItemTableComponent {

  constructor() { }

  @Input()
  public options: ItemTableOptions;
}
