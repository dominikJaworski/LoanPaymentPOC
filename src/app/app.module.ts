import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmortizedMenuComponent } from './amortized-menu/amortized-menu.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreditMenuComponent } from './credit-menu/credit-menu.component';
import { InterestMenuComponent } from './interest-menu/interest-menu.component';
import { LoanMenuComponent } from './loan-menu/loan-menu.component';
import { MaterialModule } from './material.module';
import { TableComponent } from './table/table.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoanMenuComponent,
    AmortizedMenuComponent,
    InterestMenuComponent,
    TableComponent,
    CreditMenuComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
