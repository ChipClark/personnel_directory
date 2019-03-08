import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timekeeperDept'
})
export class TimekeeperDeptPipe implements PipeTransform {

    transform(items: any[], roleid: any): any {
        if (!items || !roleid || roleid === 0) {
            return items;
        }
        if (isNaN(roleid)) {
            
            return items.filter(item => {
                if (item.legalsubdepartments) {
                    return item.legalsubdepartments.legalsubdeptfriendlyname.includes(roleid);
                }
            });
        } 
    }

}
