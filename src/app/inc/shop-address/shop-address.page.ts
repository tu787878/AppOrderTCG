import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-shop-address',
  templateUrl: './shop-address.page.html',
  styleUrls: ['./shop-address.page.scss'],
})
export class ShopAddressPage implements OnInit {

  data;
  mess:string;
  private sub_url = "/wp-json/ordertcg/v1/mobile/get/shop_standort";

  constructor(
    private router: Router,
    private storage: Storage,
    private authService: AuthGuardService,
    public toastController: ToastController,
    private http2: HTTP
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getData();
  }

  getData() {

    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token;
        console.log(url + parameter);
        
        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            console.log(dt);
            if (dt.status == "success") {
              this.data = dt.data;
            } else {
              this.authService.setAuthenticated(false);
              this.toastFailed(dt.status);
              this.router.navigate(['login']);
            }
          })
          .catch(error => {
            this.authService.setAuthenticated(false);
            this.toastFailed(error);
            this.router.navigate(['login']);
            
          });
      });
    });
  }

  saveStyle() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/ordertcg/v1/mobile/update/shop_standort";
        let url = shops[index].domain + end_url;

        this.http2.post(url, {
          access_token: access_token,
          detail: this.data.detail
        }, {})
        .then((data) => {
          let dt = data.data.split('<br />', 1);
          dt = JSON.parse(dt);
          this.mess = dt.data;
          if (dt.status == "success") {
            this.toastSuccess();
            this.getData();
          } else {
            this.toastFailed(dt.status);
          }
        })
        .catch((error) => {
          this.toastFailed(error);
        });
      });
    });
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Kategorie wurde gespeichern!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async toastFailed(status) {
    const toast = await this.toastController.create({
      message: status,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

}
