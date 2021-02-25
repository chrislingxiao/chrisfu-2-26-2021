import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty, isNil, isString } from 'lodash-es';

@Pipe({
  name: 'moneyFormat',
})
export class MoneyFormatPipe implements PipeTransform {
  constructor(private readonly decimalPipe: DecimalPipe) {}

  public transform(value: any): any {
    if (isNil(value) || (isString(value) && isEmpty(value))) {
      return null;
    }

    const currencyInteger = this.decimalPipe.transform(value, '1.2-2');

    return `${currencyInteger.toString()}`;
  }
}
