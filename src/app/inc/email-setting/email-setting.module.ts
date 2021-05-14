import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailSettingPageRoutingModule } from './email-setting-routing.module';

import { EmailSettingPage } from './email-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailSettingPageRoutingModule
  ],
  declarations: [EmailSettingPage]
})
export class EmailSettingPageModule {}
