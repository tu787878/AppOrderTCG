import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopStylePage } from './shop-style.page';

const routes: Routes = [
  {
    path: '',
    component: ShopStylePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopStylePageRoutingModule {}
