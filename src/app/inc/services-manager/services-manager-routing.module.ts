import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesManagerPage } from './services-manager.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesManagerPageRoutingModule {}
