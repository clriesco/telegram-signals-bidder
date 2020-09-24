import { AfterViewInit, Component, Input, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SignalService } from '../services/signal.service';
import { SignalDataSource} from '../services/signal.dataSource';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-active-signals',
  templateUrl: './active-signals.component.html',
  styleUrls: ['./active-signals.component.css']
})
export class ActiveSignalsComponent implements OnInit, AfterViewInit {

  dataSource: SignalDataSource;
  displayedColumns = ['creation_date', 'currency', 'commodity', 'price', 'current_price', 'percent', 'time', 'chart', 'actions'];
  len: Number;
  type = 'active';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private signalService: SignalService) {}

  ngOnInit() {
    this.dataSource = new SignalDataSource(this.signalService);
    this.dataSource.loadSignals(this.type, '',  'creation_date', 'desc', 0, 10);

  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadSignalsPage())).subscribe();

  }

  loadSignalsPage() {
    console.log(this.sort);
      this.dataSource.loadSignals(
          this.type,
          '',
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize
      );
  }


}
