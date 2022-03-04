import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from '../services/auth-guard.service';
import { Market } from '@ionic-native/market/ngx';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  name;
  logo;
  domain;
  constructor(
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    private market: Market
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        if (shops.length == 0 || shops[index] == undefined) {
          this.authService.setAuthenticated(false);
          this.router.navigate(['login']);
          return;
        }
        console.log(shops[index]);
        this.name = shops[index].shop_name;
        this.domain = shops[index].domain;
        this.logo = shops[index].logo;
      });
    });
  }

  openAppStore() {
    console.log("huhu");
    this.market.open('id1584671919');
  }


}
