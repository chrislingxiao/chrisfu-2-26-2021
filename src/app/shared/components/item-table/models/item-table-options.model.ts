import { Observable } from 'rxjs';
import { ColumnDefinition } from './column-definition.model';
export class ItemTableOptions {
  public columnDefinitions: ColumnDefinition[];
  public data$: Observable<any[]>;
  public trackBy: (item) =>any
}