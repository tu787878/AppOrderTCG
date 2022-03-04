import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController } from '@ionic/angular';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.page.html',
  styleUrls: ['./detail-order.page.scss'],
})
export class DetailOrderPage {
  orderId = null;
  private sub_url = '/wp-json/ordertcg/v1/mobile/get/order';
  data;
  mess;
  mess2;
  rechnung;

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
    private http2: HTTP
  ) {}

  ionViewWillEnter() {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('orderId');
    this.getData();
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = '?token=' + access_token + '&orderId=' + this.orderId;

        this.http2
          .get(url + parameter, {}, {})
          .then((data) => {
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);

            dt = JSON.parse(dt);
            this.mess = dt.data;
            this.mess2 = dt.data;
            if (dt.status === 'success') {
              this.data = dt.data;
              this.mess = this.data.detail.shipping_method;
               console.log(this.data);

              this.data.item = Object.keys(this.data.item).map(
                (x) => this.data.item[x]
              );

            } else {
              this.authService.setAuthenticated(false);
            }
          })
          .catch((error) => {
            this.authService.setAuthenticated(false);
          });
      });
    });
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Alles wurde aktualisiert!',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  doneOrder() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let newUrl = '/wp-json/ordertcg/v1/mobile/done/order';
        let url = shops[index].domain + newUrl;
        let parameter = '?token=' + access_token + '&orderId=' + this.orderId;

        this.http2
          .get(url + parameter, {}, {})
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
            this.authService.setAuthenticated(false);
          });
      });
    });
  }

  cancelOrder() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let newUrl = '/wp-json/ordertcg/v1/mobile/cancel/order';
        let url = shops[index].domain + newUrl;
        let parameter = '?token=' + access_token + '&orderId=' + this.orderId;

        this.http2
          .get(url + parameter, {}, {})
          .then((data) => {
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
            this.authService.setAuthenticated(false);
          });
      });
    });
  }
}
