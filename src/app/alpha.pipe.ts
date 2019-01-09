import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alpha'
})
export class AlphaPipe implements PipeTransform {

  transform(items: any[], alpha: string): any {
    if (!items || !alpha) {
        return items;
    }
    return items.filter(p => p.lastname[0].toLowerCase().includes(alpha.toLowerCase()));
  }

}
