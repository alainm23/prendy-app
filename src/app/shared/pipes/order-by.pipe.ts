import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  transform(
    array: any[],
    field: string,
    orderType: 'asc' | 'desc' = 'asc'
  ): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    const modifier = orderType === 'desc' ? -1 : 1;

    array.sort((a: any, b: any) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) {
        return -1 * modifier;
      } else if (aValue > bValue) {
        return 1 * modifier;
      } else {
        return 0;
      }
    });

    return array;
  }
}
