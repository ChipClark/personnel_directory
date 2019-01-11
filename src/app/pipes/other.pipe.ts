import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'other'
})
export class OtherPipe implements PipeTransform {

    transform(items: any[], arr: any[]): any {
        if (!items || arr.length < 1) {
            return items;
        }
        // return items.find(item => {
        //     return item.licensetype.some(i => {
        //         console.log(i.licensetypeid);
        //        return arr.indexOf(i.licensetypeid) ? true : false;
        //     });
        //   });
        const x = items.filter(item =>
            item.licensetype.some(i => {
                if (arr.indexOf(i.licensetypeid) >= 0) { return true; }
            }));
    console.log(x);
        return x;
    }

}
