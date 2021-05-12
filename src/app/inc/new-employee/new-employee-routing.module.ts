import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewEmployeePage } from './new-employee.page';

const routes: Routes = [
  {
    path: '',
    component: NewEmployeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewEmployeePageRoutingModule {}
