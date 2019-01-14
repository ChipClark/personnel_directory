import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'role'
})
export class RolePipe implements PipeTransform {

    transform(items: any[], roleid: number): any {
        if (!items || !roleid) {
            return items;
        }

        if (roleid === 20) {
            return items.filter(obj => {
                return obj.hrdepartmentid === 3 ||
                    obj.hrdepartmentid === 4 ||
                    obj.hrdepartmentid === 5 ||
                    obj.hrdepartmentid === 6 ||
                    obj.hrdepartmentid === 7 ||
                    obj.hrdepartmentid === 8 ||
                    obj.hrdepartmentid === 9 ||
                    obj.hrdepartmentid === 11 ||
                    obj.hrdepartmentid === 12;
            });
        } else {
            return items.filter(item => item.hrdepartmentid === roleid);
        }

    }

}
