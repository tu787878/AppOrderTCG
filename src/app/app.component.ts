import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AuthGuardService } from './services/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  shopname_active: string = "";
  domain_active: string = "";
  index_active: number = 0;
  shops: any;

  constructor(
    private storage: Storage,
    private auth: AuthGuardService
  ) {
    
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();

    this.storage.get('shops').then((val) => {
      if (val.length == 0) {
        console.log(val.length);
        this.auth.setAuthenticated(false);
      } else {
        this.storage.get('active_shop').then((index) => {
          this.shopname_active = val[index].shop_name;
          this.domain_active = val[index].domain;
          this.shops = val;
        })
      }
    });
  }
}
