import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'staffDept'
})
export class StaffDeptPipe implements PipeTransform {

    transform(items: any[], roleid: any): any {
        if (!items || !roleid || roleid === 0) {
            return items;
        }
        return items.filter(item => item.hrdepartmentid === roleid || item.hr );
    }

}
