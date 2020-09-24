import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatTableModule, MatButtonModule, MatIconModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { DashboardMenuComponent } from './dashboard-menu/dashboard-menu.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SignalService } from './services/signal.service';
import { ActiveSignalsComponent } from './active-signals/active-signals.component';
import { RejectedSignalsComponent } from './rejected-signals/rejected-signals.component';
import { EndedSignalsComponent } from './ended-signals/ended-signals.component';
import { WaitingSignalsComponent } from './waiting-signals/waiting-signals.component';
import { MomentModule } from 'ngx-moment';
import { ChartModule } from 'angular2-highcharts';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardMenuComponent,
    ActiveSignalsComponent,
    RejectedSignalsComponent,
    EndedSignalsComponent,
    WaitingSignalsComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AngularFontAwesomeModule,
    NgCircleProgressModule.forRoot(),
    MomentModule,
    ChartModule.forRoot(require('highcharts/highstock'))
  ],
  providers: [SignalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
