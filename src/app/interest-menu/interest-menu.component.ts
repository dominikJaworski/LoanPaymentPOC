import { Component, OnInit } from '@angular/core';
import { TableEntry } from '../models/TableEntry.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-interest-menu',
  templateUrl: './interest-menu.component.html',
  styleUrls: ['./interest-menu.component.scss']
})
export class InterestMenuComponent implements OnInit {

  loanTableOutput: TableEntry[];
  inputForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      loanAmount: ['', Validators.required],
      interestRate: ['', Validators.required],
      paymentsPerYear: ['', Validators.required]
    });
  }
  OnSubmit() {
    console.log('loanAmount: ' + this.inputForm.controls['loanAmount'].value);
    console.log('interest rate: ' + this.inputForm.controls['interestRate'].value);
    this.submitted = true;

    const la = parseFloat(this.inputForm.get('loanAmount').value);
    const ir = parseFloat(this.inputForm.get('interestRate').value);
    const py = parseFloat(this.inputForm.get('paymentsPerYear').value);

    this.loanTableOutput = this.createLoanTable(la, (ir / 100), py);

    console.table(this.loanTableOutput);
  }

  createLoanTable(loanAmount: number, interest_Rate: number, paymentsPerYear: number) {
    const starting = {
      loanAmount,
      interestRate: interest_Rate / 100,
      paymentsPerYear,
      periodicPayment: this.pmt(interest_Rate, paymentsPerYear, loanAmount), //payment for each period
      extraMonthly: 0
    };

    const table: TableEntry[] = [];

    this.calculateEntries(starting, table);

    return table;
  }

  // based off exponential decay
  pmt(rate: number, numberOfPayments: number, presentValue: number) {
    // const r = rate / 12; // per month
    // return (presentValue * r) / (1 - Math.pow(1 + r, -numberOfPeriods));

    let payment = presentValue * rate;
    payment = payment / numberOfPayments;

    return payment;
  }

  calculateEntries({ loanAmount, interestRate, paymentsPerYear, periodicPayment, extraMonthly }, table: TableEntry[]) {
    if (table.length === 0) {

      const interest = loanAmount * interestRate / paymentsPerYear;
      const principal = periodicPayment + extraMonthly - interest;

      table.push({
        startingBalance: loanAmount,
        payment: periodicPayment,
        interestPaid: interest,
        principal,
        endingBalance: loanAmount - principal,
        totalInterest: interest
      });
    } else {
      const lastRow = table[table.length - 1];

      if (lastRow.endingBalance >= 0) {
        const interest = lastRow.endingBalance * interestRate / 12;
        const principal = periodicPayment + extraMonthly - interest;
        table.push({
          startingBalance: lastRow.endingBalance,
          payment: periodicPayment + extraMonthly,
          interestPaid: interest,
          principal,
          endingBalance: lastRow.endingBalance - principal,
          totalInterest: lastRow.totalInterest + interest
        });
      } else {
        return;
      }
    }

    this.calculateEntries({loanAmount, interestRate, paymentsPerYear, periodicPayment, extraMonthly }, table);

  }

}
