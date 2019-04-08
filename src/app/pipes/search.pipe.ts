import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {

    transform(items: any[], search: string): any {
        if (!items || !search) {
            return items;
        }
        const regExp = new RegExp(search, 'gi');
        const check = p => {
            if (this.checkPhone(p, regExp)) { return true; }
            return regExp.test(p.displayname) ||
                regExp.test(p.officenumber) ||
                regExp.test(p.preferredfirstname) ||
                regExp.test(p.officelocation.officelocationcode) ||
                regExp.test(p.jobtitle.jobtitle) ||
                regExp.test(p.timekeepernumber) ||
                regExp.test(p.legalsubdeptfriendlyname);
        };
        return items.filter(check);

    }

    checkPhone(p: any, regExp: RegExp) {
        return p.phones.some(ph => {
          return ph.phonetypeid === 1 && regExp.test(ph.phonenumber);
        });
      }
}
