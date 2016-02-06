import {CallStatus} from 'collections/enums';

export class Utils {
  formatDate(date: string): string {
    if (!date) {
      return '';
    }
    let m = moment(date, [moment.ISO_8601, 'YYYY-MM-DD', 'MM/DD/YYYY', 'MM-DD-YYYY', 'M/D/YYYY', 'M/D/YY'], true);
    return m.calendar();
  }

  callStatusName(callStat: number) {
    return CallStatus[callStat].split(/(?=[A-Z])/).join(' ');
  }

  callStatusColorClass(callStat: number) {
    switch (this.callStatusName(callStat)) {
      case 'New':
        return 'label-default';
      case 'No Answer':
        return 'label-info'
      case 'Left Message':
        return 'label-info';
      case 'Wait To Call Back':
        return 'label-info'
      case 'Phone Disconnected':
        return 'label-warning';
      case 'Wrong Number':
        return 'label-warning'
      case 'Accepted':
        return 'label-success';
      case 'Tentative':
        return 'label-info'
      case 'Declined':
        return 'label-danger';
      case 'Future':
        return 'label-primary'
      case 'Flown Already':
        return 'label-primary';
      case 'Remove':
        return 'label-warning';
      case 'Deceased':
        return 'label-danger';
      default:
        return 'label-default';
    }
  }
}
