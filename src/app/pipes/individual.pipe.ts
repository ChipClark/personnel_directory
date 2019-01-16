import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'individual'
})
export class IndividualPipe implements PipeTransform {

  transform(items: any[], id: number): any {
    if (!items || !id) {
        return items;
    }
    return items.filter(p => p.pkpersonid === id);
  }

}
