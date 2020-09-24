import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Signal } from '../models/signal';
import { SignalService } from './signal.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { debug } from 'util';

export class SignalDataSource implements DataSource<Signal> {

    private signalsSubject = new BehaviorSubject<Signal[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public signalsLength = 0;

    public loading$ = this.loadingSubject.asObservable();

    constructor(private signalService: SignalService) {}

    loadSignals(signalType: string,
                filter: string,
                sortDirection: string,
                sortActive: string,
                pageIndex: number,
                pageSize: number) {

        this.loadingSubject.next(true);
        this.signalService.getSignalsCount(signalType, filter).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(count => this.signalsLength = <number>count);

        this.signalService.getSignals(
            signalType, filter, sortDirection,
            sortActive, pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(signals => this.signalsSubject.next(signals));

    }

    connect(collectionViewer: CollectionViewer): Observable<Signal[]> {
        return this.signalsSubject.asObservable();
    }
    obs(): Observable<Signal[]> {
        return this.signalsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.signalsSubject.complete();
        this.loadingSubject.complete();
    }

}
