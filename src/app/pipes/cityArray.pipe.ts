import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cityArray',
  pure: false
})
export class CityArrayPipe implements PipeTransform {

  transform(items: any[], cityidArr: any[]): any {
    if (!items || !cityidArr) {
        return items;
    }
   return items.filter(item => cityidArr.some(c => c === item.officelocationid));
  }

}
