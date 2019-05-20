import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CreditEntry } from '../models/CreditEntry.model';
import { TableEntry } from '../models/TableEntry.model';

@Component({
  selector: 'app-credit-menu',
  templateUrl: './credit-menu.component.html',
  styleUrls: ['./credit-menu.component.scss']
})
export class CreditMenuComponent implements OnInit {
  loanTableOutput: TableEntry[];
  inputForm: FormGroup;
  submitted = false;
  //success = false;
  loanType = 1;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      cardBalance: ['', Validators.required],
      annualRate: ['', Validators.required],
      minPercent: ['', Validators.required],
      minCost: ['', Validators.required]
    });
  }
  //change how the table is displayed by changing the template and making all loan types use the same columns
  OnSubmit() {
    console.log('card Balance: ' + this.inputForm.controls['cardBalance'].value);
    console.log('annual rate: ' + this.inputForm.controls['annualRate'].value);

    this.submitted = true;

    const cb = parseFloat(this.inputForm.get('cardBalance').value);
    const ar = parseFloat(this.inputForm.get('annualRate').value);
    const mp = parseFloat(this.inputForm.get('minPercent').value);
    const mc = parseFloat(this.inputForm.get('minCost').value);

    this.loanTableOutput = this.createLoanTable(cb, (ar / 100), (mp / 100), mc);
    console.table(this.loanTableOutput);
  }

  createLoanTable(cardBalance: number, annualRate: number, minPercent: number, minCost: number) {
    const starting = {
      cardBalance,
      annualRate,
      minPercent,
      minCost
    };

    const table: TableEntry[] = [];

    this.calculateEntries(starting, table);

    return table;
  }

  // based off exponential decay
  pmt(annualRate: number, numberOfPeriods: number, presentValue: number) {
    const r = annualRate / 12; // per month
    return (presentValue * r) / (1 - Math.pow(1 + r, -numberOfPeriods));
  }

  calculateEntries({ cardBalance, annualRate, minPercent, minCost }, table: TableEntry[]) {
    if (table.length === 0) {

      const minPayment = Math.max(minCost, minPercent * cardBalance);
      const interest = cardBalance * ((annualRate) / 12);
      const thePrincipal = minPayment - interest;
      const theBalance = cardBalance - thePrincipal;

      table.push({
        startingBalance: cardBalance,
        payment: minPayment,
        interestPaid: interest,
        principal: theBalance,
        endingBalance: theBalance,
        totalInterest: interest
      });
    } else {
      const lastRow = table[table.length - 1];

      if (lastRow.endingBalance > 0) {
        const minPayment = Math.max(lastRow.endingBalance * minPercent, minCost);
        const interest = lastRow.endingBalance * (annualRate / 12);
        const thePrincipal = minPayment - interest;
        const theBalance = lastRow.endingBalance - thePrincipal;

        table.push({
          startingBalance: lastRow.endingBalance,
          payment: minPayment,
          interestPaid: interest,
          principal: thePrincipal,
          endingBalance: theBalance,
          totalInterest: lastRow.totalInterest + interest
        });
      } else {
        return;
      }
    }

    this.calculateEntries({cardBalance, annualRate, minPercent, minCost }, table);

  }

}
