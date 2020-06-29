import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'amFromUnix' })
export class FromUnixPipe implements PipeTransform {
  transform(value: any, ...args: string[]): any {
    if (typeof value === 'string') {
      value = +value;
    }
    return moment.unix(value);
  }
}