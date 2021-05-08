import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditParentPageRoutingModule } from './edit-parent-routing.module';

import { EditParentPage } from './edit-parent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditParentPageRoutingModule
  ],
  declarations: [EditParentPage]
})
export class EditParentPageModule {}
