import { AfterViewInit, Component, Input, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SignalService } from '../services/signal.service';
import { SignalDataSource} from '../services/signal.dataSource';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-rejected-signals',
  templateUrl: './rejected-signals.component.html',
  styleUrls: ['./rejected-signals.component.css']
})
export class RejectedSignalsComponent implements OnInit, AfterViewInit {

  dataSource: SignalDataSource;
  displayedColumns = ['creation_date', 'currency', 'commodity', 'actions'];
  len: Number;
  type = 'rejected';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private signalService: SignalService) {}

  ngOnInit() {
    this.dataSource = new SignalDataSource(this.signalService);
    this.dataSource.loadSignals(this.type, '',  'creation_date', 'desc', 0, 10);

  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
          this.paginator.pageIndex = 0;

          this.loadSignalsPage();
      })
  )
  .subscribe();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadSignalsPage())).subscribe();

  }

  loadSignalsPage() {
    console.log(this.sort);
      this.dataSource.loadSignals(
          this.type,
          this.input.nativeElement.value,
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize
      );
  }


}
