import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditParentPage } from './edit-parent.page';

const routes: Routes = [
  {
    path: '',
    component: EditParentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditParentPageRoutingModule {}
