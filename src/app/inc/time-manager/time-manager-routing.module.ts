import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeManagerPage } from './time-manager.page';

const routes: Routes = [
  {
    path: '',
    component: TimeManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeManagerPageRoutingModule {}
