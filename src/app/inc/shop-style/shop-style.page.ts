import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-shop-style',
  templateUrl: './shop-style.page.html',
  styleUrls: ['./shop-style.page.scss'],
})
export class ShopStylePage implements OnInit {
  data;
  mess;
  thumbnail: boolean;
  float: boolean;
  private sub_url = "/wp-json/ordertcg/v1/mobile/get/shop_style";

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
            this.mess = dt.status;
            if (dt.status == "success") {
              this.data = dt.data;
              this.thumbnail = this.data.detail.thumbnail == 1 ? true : false;
              this.float = this.data.detail.float_cart == "on" ? true : false;
            } else {
              this.authService.setAuthenticated(false);
              this.toastFailed();
              this.router.navigate(['login']);
            }
          })
          .catch(error => {
            this.authService.setAuthenticated(false);
            this.toastFailed();
            this.router.navigate(['login']);
            
          });
      });
    });
  }

  saveStyle() {
    this.data.detail.thumbnail = this.thumbnail ? 1 : 0;
    this.data.detail.float_cart = this.float ? "on" : "off";

    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/ordertcg/v1/mobile/update/shop_style";
        let url = shops[index].domain + end_url;

        this.http2.post(url, {
          access_token: access_token,
          detail: this.data.detail
        }, {})
        .then((data) => {
          let dt = data.data.split('<br />', 1);
          dt = JSON.parse(dt);

          if (dt.status == "success") {
            this.toastSuccess();
              this.router.navigate(['tabs', 'tab4', 'shop-style']);
          } else {
            this.toastFailed();
          }
        })
        .catch((error) => {
          this.toastFailed();
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

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal!',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

}
