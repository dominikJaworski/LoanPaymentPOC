import { Component, OnInit, Output } from '@angular/core';
import { MatRadioGroup, MatRadioButton, MatButton } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-loan-menu',
  templateUrl: './loan-menu.component.html',
  styleUrls: ['./loan-menu.component.scss']
})
export class LoanMenuComponent implements OnInit {

  modeControl = new FormControl('A');

  navLinks = [{ path: '/amortized', label: 'Amortized Loan' }, { path: '/credit', label: 'Credit Card' }];
  @Output() modeChanged = this.modeControl.valueChanges;

  constructor(private router: Router) { }

  ngOnInit() {
    this.modeControl.valueChanges.subscribe(str => {
      switch (str) {
        case 'A': this.router.navigate(['/amortized']); break;
        case 'C': this.router.navigate(['/credit']); break;
      }

    })
  }

}
