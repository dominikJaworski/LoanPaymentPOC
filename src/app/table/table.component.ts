import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableEntry } from '../models/TableEntry.model';
import { MatTableModule } from '@angular/material';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {

  @Input() loanTableOutput: TableEntry[] | null;
  displayedColumns: string[];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

  }



}
