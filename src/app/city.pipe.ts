import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'city'
})
export class CityPipe implements PipeTransform {

  transform(items: any[], cityid: number): any {
    if (!items || !cityid) {
        return items;
    }
    return items.filter(item => item.officelocationid === cityid);
  }

}
