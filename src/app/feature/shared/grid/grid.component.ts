import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from 'src/app/core/models/grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent<TData> {
  @Input() title?: string;
  @Input() tableData?: Array<TData> = [];
  @Input() columns?: Array<Column> = [];

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<TData>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.displayedColumns = this.columns.map(x => x.prop);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData']) {
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  getCellValue(element: any, column: Column) {
    let value = element[column.prop];
    if (value === undefined || value === null)
      return '';
    if (column.isDateColumn) {
      try {
        return this.datePipe.transform(value, column.dateFormat ?? 'dd-MM-yyyy')!;
      } catch {
        return value;
      }
    }

    return value;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
