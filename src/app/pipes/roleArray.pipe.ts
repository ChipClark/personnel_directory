import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roleArray',
    pure: false
})
export class RoleArrayPipe implements PipeTransform {

    transform(items: any[], roleidArr: any[]): any {
        if (!items || !roleidArr) {
            return items;
        }
        return items.filter(item => roleidArr.some(c => {
            if (c === 20) {
                return item.hrdepartmentid === 3 ||
                    item.hrdepartmentid === 4 ||
                    item.hrdepartmentid === 5 ||
                    item.hrdepartmentid === 6 ||
                    item.hrdepartmentid === 7 ||
                    item.hrdepartmentid === 8 ||
                    item.hrdepartmentid === 9 ||
                    item.hrdepartmentid === 11 ||
                    item.hrdepartmentid === 12;

            } else {
                return c === item.hrdepartmentid;
            }
        }));
    }

}
