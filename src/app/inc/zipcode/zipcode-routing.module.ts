import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZipcodePage } from './zipcode.page';

const routes: Routes = [
  {
    path: '',
    component: ZipcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZipcodePageRoutingModule {}
