import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Signal } from '../models/signal';
import { map } from 'rxjs/operators';
import { AppSettings } from '../app.config';
import * as moment from 'moment';
import 'moment-duration-format';


@Injectable()
export class SignalService {

    constructor(private http: HttpClient) {
    }

    getSignals(type = '', filter = '', sortActive = 'creation_date', sortDirection = 'desc',
        pageNumber = 0, pageSize = 3): Observable<Signal[]> {
        return this.http.get(AppSettings.API_ENDPOINT + '/api/signals', {
            params: new HttpParams()
                .set('filter', filter)
                .set('type', type)
                .set('sortDirection', sortDirection)
                .set('sortActive', sortActive)
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        }).pipe(
            map(res => {
                res = (<Signal[]>res).map(sig => {
                    const lastDate = sig.close_date || Date.now();
                    const ms = moment(lastDate).diff(sig.creation_date);
                    sig.time = moment.duration(ms).format('h [hrs], m [min], s [sec]');
                    const lastPrice = sig.close_price || sig.current_price;
                    sig.percent = (lastPrice / sig.price - 1) * 100;
                    return sig;
                });
                return <Signal[]>res;
            })
        );
    }

    getSignalsCount(type = '', filter = ''): Observable<number> {
        return this.http.get(AppSettings.API_ENDPOINT + '/api/signals-length', {
            params: new HttpParams()
                .set('filter', filter)
                .set('type', type)
        }).pipe(
            map(res => <number>res)
        );
    }

    getStats(): Observable<any> {
        return this.http.get(AppSettings.API_ENDPOINT + '/api/stats').pipe(
            map(res => <any>res)
        );
    }
}
