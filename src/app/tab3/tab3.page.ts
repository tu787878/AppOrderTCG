import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthGuardService } from '../services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  data: any;
  mess;
  xx;
  suche = '';
  cat = '';
  private sub_url = '/wp-json/ordertcg/v1/mobile/get/product';
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    private http2: HTTP,
    public toastController: ToastController
  ) {}
  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.data = null;
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        if (shops.length == 0 || shops[index] == undefined) {
          this.authService.setAuthenticated(false);
          this.router.navigate(['login']);
          return;
        }
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = '?token=' + access_token + '&date_from=' + this.suche + '&category=' + this.cat;
        this.http2
          .get(url + parameter, {}, {})
          .then((data) => {
            console.log(data);
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            //this.mess = dt.data.categories.length;
            this.xx = dt.data.test;
            if (dt.status === 'success') {
              this.data = dt.data;
            } else {
              this.authService.setAuthenticated(false);
            }
          })
          .catch((error) => {
            this.authService.setAuthenticated(false);
            console.log(error);
            
          });
      });
    });
  }

  changeStockStatus(postId, stockStatus) {
    let value = (stockStatus == 'outstock') ? 'instock' : 'outstock';
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = '/wp-json/ordertcg/v1/mobile/update/product';
        let url = shops[index].domain + end_url;

        this.http2
          .post(url, {
            access_token: access_token,
            id: postId,
            value: value,
          }, {})
          .then((data) => {
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);

            if (dt.status === 'success') {
              this.toastSuccess();
              this.getData();
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
      message: 'Produkt wurde aktualisiert!',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal!',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  changeFilter() {
    this.getData();
  }
}
