import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AmortizedEntry } from '../models/AmortizedEntry.model';
import { TableEntry } from '../models/TableEntry.model';
import { CalculateService } from '../calculate.service';

@Component({
  selector: 'app-amortized-menu',
  templateUrl: './amortized-menu.component.html',
  styleUrls: ['./amortized-menu.component.scss']
})
export class AmortizedMenuComponent implements OnInit {

  loanTableOutput: TableEntry[];
  inputForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private calc: CalculateService) { }

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      loanAmount: ['100000', Validators.required],
      interestRate: ['6', Validators.required],
      termYears: ['30', Validators.required],
      preferredPayment: ['700', Validators.required]
    });
  }
  OnSubmit() {
    console.log('loanAmount: ' + this.inputForm.controls['loanAmount'].value);
    console.log('interest rate: ' + this.inputForm.controls['interestRate'].value);
    console.log('preferred Flat Payment: ' + this.inputForm.controls['preferredPayment'].value);
    this.submitted = true;

    const la = parseFloat(this.inputForm.get('loanAmount').value);
    const ir = parseFloat(this.inputForm.get('interestRate').value);
    const ty = parseFloat(this.inputForm.get('termYears').value);
    const pp = parseFloat(this.inputForm.get('preferredPayment').value);

    this.loanTableOutput = this.createLoanTable(la, (ir / 100), ty, pp);

    console.table(this.loanTableOutput);
  }

  createLoanTable(loanAmount: number, interest_Rate: number, termYears: number, preferredPayment: number) {

    const minRequiredPayment = this.calc.pmt(interest_Rate, termYears * 12, loanAmount);
    const payment = Math.max(minRequiredPayment, preferredPayment);

    const starting = {
      loanAmount,
      interestRate: interest_Rate,
      term: termYears,
      monthlyPayment: payment,
    };

    const table: TableEntry[] = [];

    const interest = starting.monthlyPayment * (starting.interestRate / 12);
    const principal = starting.monthlyPayment - interest;

    this.tablePush(starting.loanAmount, starting.monthlyPayment, interest, principal, 0, table);
    this.calculateEntries(starting, table);

    return table;
  }

  // based off exponential decay
  pmt(rate: number, numberOfPeriods: number, presentValue: number) {
    const r = rate / 12; // per month
    return (presentValue * r) / (1 - Math.pow(1 + r, -numberOfPeriods));
  }

  calculateEntries({ loanAmount, interestRate, term, monthlyPayment }, table: TableEntry[]) {

    const lastRow = table[table.length - 1];

    if (lastRow.endingBalance > 0) {
      const interest = lastRow.endingBalance * interestRate / 12;
      const principal = monthlyPayment - interest;

      this.calc.tablePush(lastRow.endingBalance, monthlyPayment, interest, principal, lastRow.totalInterest, table)
    } else {
      return;
    }
    this.calculateEntries({loanAmount, interestRate, term, monthlyPayment }, table);
  }

  tablePush(balance, payment, interest, principal, totalInterest, table: TableEntry[]) {
    table.push({
      startingBalance: balance,
      payment,
      interestPaid: interest,
      principal,
      endingBalance: balance - principal,
      totalInterest: totalInterest + interest
    });
  }
}
