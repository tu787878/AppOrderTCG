import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AuthGuardService } from './services/auth-guard.service';
import { Tab1Page } from './tab1/tab1.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  shopname_active: string = "";
  domain_active: string = "";
  logo_active;
  index_active: number = 0;
  shops: any;
  

  constructor(
    private storage: Storage,
    private auth: AuthGuardService,
    private router: Router,
  ) {
    
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();

    
  }

  menuOpened() {
    console.log("hihi");
    this.storage.get('shops').then((val) => {
      console.log(val.length);
      if (val.length == 0) {
        this.auth.setAuthenticated(false);
      } else {
        this.storage.get('active_shop').then((index) => {
          this.shopname_active = val[index].shop_name;
          this.domain_active = val[index].domain;
          this.shops = val;
          this.logo_active = val[index].logo;
        })
      }
    });
  }

  toAddShop() {
    this.router.navigate(['login']);
  }

  setActiveShop(domain:string){
    for (let index = 0; index < this.shops.length; index++) {
      const element = this.shops[index];
      if (element.domain === domain) {
        this.storage.set('active_shop', index);
        this.shopname_active = element.shop_name;
        this.domain_active = element.domain;
        this.index_active = index;
        this.logo_active = element.logo;
      }
    }
  }

  menuWillClose() {
  }

  logout(){
    this.shops = this.shops.filter(e => e.domain != this.domain_active);
    this.storage.set('shops', this.shops);
    if (this.shops.length == 0) {
      this.storage.set('active_shop', -1);
      this.router.navigate(['login']);
      this.domain_active = ""
      this.shopname_active = "";
      this.logo_active = "";
      this.index_active = -1;
    } else {
      this.storage.set('active_shop', 0);
      this.domain_active = this.shops[0].domain;
      this.shopname_active = this.shops[0].shop_name;
      this.logo_active = this.shops[0].logo;
      this.index_active = 0;
    }
  }
}
