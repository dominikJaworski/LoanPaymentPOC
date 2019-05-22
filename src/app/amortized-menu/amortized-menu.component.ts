import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AmortizedEntry } from '../models/AmortizedEntry.model';
import { TableEntry } from '../models/TableEntry.model';

@Component({
  selector: 'app-amortized-menu',
  templateUrl: './amortized-menu.component.html',
  styleUrls: ['./amortized-menu.component.scss']
})
export class AmortizedMenuComponent implements OnInit {

  loanTableOutput: TableEntry[];
  inputForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      loanAmount: ['', Validators.required],
      interestRate: ['', Validators.required],
      termYears: ['', Validators.required]
    });
  }
  OnSubmit() {
    console.log('loanAmount: ' + this.inputForm.controls['loanAmount'].value);
    console.log('interest rate: ' + this.inputForm.controls['interestRate'].value);
    this.submitted = true;

    const la = parseFloat(this.inputForm.get('loanAmount').value);
    const ir = parseFloat(this.inputForm.get('interestRate').value);
    const ty = parseFloat(this.inputForm.get('termYears').value);

    this.loanTableOutput = this.createLoanTable(la, (ir / 100), ty);

    console.table(this.loanTableOutput);
  }

  createLoanTable(loanAmount: number, interest_Rate: number, termYears: number) {
    const starting = {
      loanAmount,
      interestRate: interest_Rate,
      term: termYears,
      monthlyPayment: this.pmt(interest_Rate, termYears * 12, loanAmount),
      extraMonthly: 0
    };

    const table: TableEntry[] = [];

    this.calculateEntries(starting, table);

    return table;
  }

  // based off exponential decay
  pmt(rate: number, numberOfPeriods: number, presentValue: number) {
    const r = rate / 12; // per month
    return (presentValue * r) / (1 - Math.pow(1 + r, -numberOfPeriods));
  }

  calculateEntries({ loanAmount, interestRate, term, monthlyPayment, extraMonthly }, table: TableEntry[]) {
    if (table.length === 0) {

      const interest = loanAmount * interestRate / 12;
      const principal = monthlyPayment + extraMonthly - interest;

      table.push({
        startingBalance: loanAmount,
        payment: monthlyPayment,
        interestPaid: interest,
        principal,
        endingBalance: loanAmount - principal,
        totalInterest: interest
      });
    } else {
      const lastRow = table[table.length - 1];

      if (lastRow.endingBalance >= 0) {
        const interest = lastRow.endingBalance * interestRate / 12;
        const principal = monthlyPayment + extraMonthly - interest;
        table.push({
          startingBalance: lastRow.endingBalance,
          payment: monthlyPayment + extraMonthly,
          interestPaid: interest,
          principal,
          endingBalance: lastRow.endingBalance - principal,
          totalInterest: lastRow.totalInterest + interest
        });
      } else {
        return;
      }
    }

    this.calculateEntries({loanAmount, interestRate, term, monthlyPayment, extraMonthly }, table);

  }
}
