import { Component, OnInit } from '@angular/core';
import { TableEntry } from '../models/TableEntry.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalculateService } from '../calculate.service';

@Component({
  selector: 'app-interest-menu',
  templateUrl: './interest-menu.component.html',
  styleUrls: ['./interest-menu.component.scss']
})
export class InterestMenuComponent implements OnInit {

  loanTableOutput: TableEntry[];
  inputForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private calc: CalculateService) { }

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      loanAmount: ['100000', Validators.required],
      interestRate: ['6', Validators.required],
      preferredPayment: ['700', Validators.required]
    });
  }
  OnSubmit() {
    console.log('loanAmount: ' + this.inputForm.controls['loanAmount'].value);
    console.log('interest rate: ' + this.inputForm.controls['interestRate'].value);
    this.submitted = true;

    const la = parseFloat(this.inputForm.get('loanAmount').value);
    const ir = parseFloat(this.inputForm.get('interestRate').value);
    const pp = parseFloat(this.inputForm.get('preferredPayment').value);

    this.loanTableOutput = this.createLoanTable(la, (ir / 100), pp);

    console.table(this.loanTableOutput);
  }

  createLoanTable(loanAmount: number, interest_Rate: number, preferredPayment: number) {

    const starting = {
      loanAmount,
      interestRate: interest_Rate,
      monthlyPayment: preferredPayment
    };

    const table: TableEntry[] = [];

    const interest = starting.loanAmount * starting.interestRate / 12;
    const principal = starting.loanAmount - interest;

    this.calc.tablePush(starting.loanAmount, starting.monthlyPayment, interest, principal, 0, table);

    this.calculateEntries(starting, table);

    return table;
  }

  calculateEntries({ loanAmount, interestRate, monthlyPayment }, table: TableEntry[]) {
    const lastRow = table[table.length - 1];

    if (lastRow.endingBalance > 0) {
      const interest = lastRow.endingBalance * interestRate / 12;
      const principal = monthlyPayment - interest;

      this.calc.tablePush(lastRow.endingBalance, monthlyPayment, interest, principal, lastRow.totalInterest, table)
    } else {
      return;
    }
    this.calculateEntries({ loanAmount, interestRate, monthlyPayment }, table);
  }

  // console.log("before first row: loanAmount",loanAmount, "interestRate",interestRate, "paymentsPerYear",paymentsPerYear, "periodicPayment", periodicPayment, extraMonthly);
  // if (table.length === 0) {

  //   const interest = loanAmount * interestRate / paymentsPerYear;
  //   const principal = periodicPayment + extraMonthly - interest;
  //   console.log("first row interest: ", interest, "= ", loanAmount, " * (", interestRate, " / ", paymentsPerYear, ")");
  //   console.log("first row principal:", principal, " = ", periodicPayment, " + ", extraMonthly, " - ", interest);
  //   table.push({
  //     startingBalance: loanAmount,
  //     payment: periodicPayment,
  //     interestPaid: interest,
  //     principal,
  //     endingBalance: loanAmount - principal - interest,
  //     totalInterest: interest
  //   });
  // } else {
  //   const lastRow = table[table.length - 1];
  //   //console.log("before next row: loanAmount ",loanAmount, "interestRate ",interestRate, "paymentsPerYear ",paymentsPerYear, "periodicPayment ", periodicPayment, extraMonthly);
  //   if (lastRow.endingBalance >= 0) {

  //     const interest = lastRow.endingBalance * (interestRate / paymentsPerYear);
  //     const principal = periodicPayment + extraMonthly - interest;
  //     console.log("next row interest: ", interest, "= ", loanAmount, " * (", interestRate, " / ", paymentsPerYear, ")");
  //     console.log("next row principal:", principal, " = ", periodicPayment, " + ", extraMonthly, " - ", interest);
  //     table.push({
  //       startingBalance: lastRow.endingBalance,
  //       payment: periodicPayment + extraMonthly,
  //       interestPaid: interest,
  //       principal,
  //       endingBalance: lastRow.endingBalance - principal - interest,
  //       totalInterest: lastRow.totalInterest + interest
  //     });


  //   } else {
  //     return;
  //   }
  // }

  // this.calculateEntries({loanAmount, interestRate, paymentsPerYear, periodicPayment, extraMonthly }, table);

}
