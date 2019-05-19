import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatRadioModule, MatButtonModule, MatTabsModule, MatTableModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
const modules = [MatInputModule, MatRadioModule, MatButtonModule, ReactiveFormsModule, FormsModule, MatTabsModule, MatTableModule]
@NgModule({
  declarations: [],
  imports: modules,
  exports: modules

})
export class MaterialModule { }
