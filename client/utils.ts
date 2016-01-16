/// <reference path="../typings/moment.d.ts" />

export class Utils {
  formatDate(date: string): string {
    if (!date) {
      return '';
    }
    let m = moment(date, [moment.ISO_8601, 'YYYY-MM-DD', 'MM/DD/YYYY', 'MM-DD-YYYY', 'M/D/YYYY', 'M/D/YY'], true);
    return m.calendar()
  }
}
