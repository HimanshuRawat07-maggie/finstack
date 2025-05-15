import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constants } from 'src/app/core/constants/app-constant';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  providers: [],
})
export class DateFilterComponent {
  constants = Constants;
  @Input() dateFormat: string = this.constants.ThisMonth;
  @Input() fromDate: string = '';
  @Input() toDate: string = '';
  @Input() showCustomOption: boolean = true;
  @Output() dateChange = new EventEmitter<any>();
   minDate: string = '';

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.minDate = localStorage.getItem('minDate');
    this.setDates();
  }

  setDates() {
    let todaysDate = new Date();
    switch (this.dateFormat) {
      case this.constants.ThisMonth:
        this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1), 'yyyy-MM-dd')!;
        this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth() + 1, 0), 'yyyy-MM-dd')!;
        break;

      case this.constants.LastMonth:
        this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth() - 1, 1), 'yyyy-MM-dd')!;
        this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 0), 'yyyy-MM-dd')!;
        break;

      case this.constants.ThisQuarter:
        if (todaysDate.getMonth() >= 3 && todaysDate.getMonth() <= 5) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 6, 0), 'yyyy-MM-dd')!;
        } else if (todaysDate.getMonth() >= 6 && todaysDate.getMonth() <= 8) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 6, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 9, 0), 'yyyy-MM-dd')!;
        } else if (todaysDate.getMonth() >= 9 && todaysDate.getMonth() <= 11) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 9, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear() + 1, 0, 0), 'yyyy-MM-dd')!;
        } else if (todaysDate.getMonth() >= 0 && todaysDate.getMonth() <= 2) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 0, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 0), 'yyyy-MM-dd')!;
        }
        break;

      case this.constants.LastQuarter:
        if (todaysDate.getMonth() >= 3 && todaysDate.getMonth() <= 5) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 0, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 0), 'yyyy-MM-dd')!;
        } else if (todaysDate.getMonth() >= 6 && todaysDate.getMonth() <= 8) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 6, 0), 'yyyy-MM-dd')!;
        } else if (todaysDate.getMonth() >= 9 && todaysDate.getMonth() <= 11) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 6, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 9, 0), 'yyyy-MM-dd')!;
        } else if (todaysDate.getMonth() >= 0 && todaysDate.getMonth() <= 2) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear() - 1, 9, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 0, 0), 'yyyy-MM-dd')!;
        }
        break;

      case this.constants.ThisYear:
        if (todaysDate.getMonth() >= 3 && todaysDate.getMonth() <= 11) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear() + 1, 3, 0), 'yyyy-MM-dd')!;
        } else {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear() - 1, 3, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 0), 'yyyy-MM-dd')!;
        }
        break;

      case this.constants.LastYear:
        if (todaysDate.getMonth() >= 3 && todaysDate.getMonth() <= 11) {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear() - 1, 3, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear(), 3, 0), 'yyyy-MM-dd')!;
        } else {
          this.fromDate = this.datePipe.transform(new Date(todaysDate.getFullYear() - 2, 3, 1), 'yyyy-MM-dd')!;
          this.toDate = this.datePipe.transform(new Date(todaysDate.getFullYear() - 1, 3, 0), 'yyyy-MM-dd')!;
        }
        break;
    }
    this.onDateChange();
  }

  onDateChange() {    
    this.dateChange.emit({ fromDate: this.fromDate, toDate: this.toDate, dateFormat: this.dateFormat });
  }
}
