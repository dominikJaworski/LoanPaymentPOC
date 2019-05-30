import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CreditEntry } from '../models/CreditEntry.model';
import { TableEntry } from '../models/TableEntry.model';
import { CalculateService } from '../calculate.service';
import { calcBindingFlags } from '@angular/core/src/view/util';

@Component({
  selector: 'app-credit-menu',
  templateUrl: './credit-menu.component.html',
  styleUrls: ['./credit-menu.component.scss']
})
export class CreditMenuComponent implements OnInit {
  loanTableOutput: TableEntry[];
  inputForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private calc: CalculateService) { }

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      cardBalance: ['7000', Validators.required],
      annualRate: ['12', Validators.required],
      minPercent: ['3', Validators.required],
      minCost: ['30', Validators.required],
      preferredPayment: ['600', Validators.required]
    });
  }

  OnSubmit() {
    console.log('card Balance: ' + this.inputForm.controls['cardBalance'].value);
    console.log('annual rate: ' + this.inputForm.controls['annualRate'].value);

    this.submitted = true;

    const cb = parseFloat(this.inputForm.get('cardBalance').value);
    const ar = parseFloat(this.inputForm.get('annualRate').value);
    const mp = parseFloat(this.inputForm.get('minPercent').value);
    const mc = parseFloat(this.inputForm.get('minCost').value);
    const pp = parseFloat(this.inputForm.get('preferredPayment').value);

    this.loanTableOutput = this.createLoanTable(cb, (ar / 100), (mp / 100), mc, pp);
    console.table(this.loanTableOutput);
  }

  createLoanTable(cardBalance: number, annualRate: number, minPercent: number, minFlatCost: number, preferredPayment: number) {

    const monthlyPayment = Math.max(minPercent, minFlatCost, preferredPayment);

    const starting = {
      cardBalance,
      annualRate,
      minPercent,
      minFlatCost,
      preferredPayment
    };

    const table: TableEntry[] = [];

    const interest = cardBalance * ((annualRate) / 12);
    const principal = monthlyPayment - interest;

    console.log("interest =", interest, "principal =", principal);

    this.calc.tablePush(cardBalance, monthlyPayment, interest, principal, 0, table);
    this.calculateEntries(starting, table);

    return table;
  }

  calculateEntries({ cardBalance, annualRate, minPercent, minFlatCost, preferredPayment }, table: TableEntry[]) {

    const lastRow = table[table.length - 1];

    if (lastRow.endingBalance > 0) {
      const monthlyPayment = Math.max(minPercent, minFlatCost, preferredPayment)
      const interest = lastRow.endingBalance * annualRate / 12;
      const principal = monthlyPayment - interest;

      this.calc.tablePush(lastRow.endingBalance, monthlyPayment, interest, principal, lastRow.totalInterest, table);
    } else {
      return;
    }
    this.calculateEntries({cardBalance, annualRate, minPercent, minFlatCost, preferredPayment }, table);
    // if (table.length === 0) {

    //   const minPayment = Math.max(minFlatCost, minPercent * cardBalance, preferredPayment);
    //   const interest = cardBalance * ((annualRate) / 12);
    //   const thePrincipal = minPayment - interest;
    //   const theBalance = cardBalance - thePrincipal;

    //   table.push({
    //     startingBalance: cardBalance,
    //     payment: minPayment,
    //     interestPaid: interest,
    //     principal: thePrincipal,
    //     endingBalance: theBalance,
    //     totalInterest: interest
    //   });
    // } else {
    //   const lastRow = table[table.length - 1];

    //   if (lastRow.endingBalance > 0) {
    //     const minPayment = Math.max(lastRow.endingBalance * minPercent, minFlatCost);
    //     const interest = lastRow.endingBalance * (annualRate / 12);
    //     const thePrincipal = minPayment - interest;
    //     const theBalance = lastRow.endingBalance - thePrincipal;

    //     table.push({
    //       startingBalance: lastRow.endingBalance,
    //       payment: minPayment,
    //       interestPaid: interest,
    //       principal: thePrincipal,
    //       endingBalance: theBalance,
    //       totalInterest: lastRow.totalInterest + interest
    //     });
    //   } else {
    //     return;
    //   }
    // }

    // this.calculateEntries({cardBalance, annualRate, minPercent, minFlatCost }, table);

  }

}
