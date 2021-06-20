import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {
  data;
  dsmart_method_ship: boolean;
  dsmart_method_direct: boolean;
  close_shop: boolean;
  mess;

  open_1 = [];
  open_2 = [];

  day_of_week = [
    {
      text: "Montag",
      value: "mo"
    },
    {
      text: "Dienstag",
      value: "tu"
    },
    {
      text: "Mittwoch",
      value: "we"
    },
    {
      text: "Donnerstag",
      value: "th"
    },
    {
      text: "Freitag",
      value: "fr"
    },
    {
      text: "Samstag",
      value: "sa"
    },
    {
      text: "Sonntag",
      value: "su"
    }
  ]

  private sub_url = "/wp-json/ordertcg/v1/mobile/get/delivery";
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
            if (dt.status == "success") {
              this.data = dt.data;
              this.dsmart_method_ship = this.data.detail.dsmart_method_ship == "on" ? true : false;
              this.dsmart_method_direct = this.data.detail.dsmart_method_direct == "on" ? true : false;
              this.close_shop = this.data.detail.close_shop == "on" ? true : false;
            
              this.open_1 = [
                {
                  text: "Montag",
                  open: this.data.detail.time_open_shop_mo,
                  close: this.data.detail.time_close_shop_mo
                },
                {
                  text: "Dienstag",
                  open: this.data.detail.time_open_shop_tu,
                  close: this.data.detail.time_close_shop_tu
                },
                {
                  text: "Mittwoch",
                  open: this.data.detail.time_open_shop_we,
                  close: this.data.detail.time_close_shop_we
                },
                {
                  text: "Donnerstag",
                  open: this.data.detail.time_open_shop_th,
                  close: this.data.detail.time_close_shop_th
                },
                {
                  text: "Freitag",
                  open: this.data.detail.time_open_shop_fr,
                  close: this.data.detail.time_close_shop_fr
                },
                {
                  text: "Samstag",
                  open: this.data.detail.time_open_shop_sa,
                  close: this.data.detail.time_close_shop_sa
                },
                {
                  text: "Sonntag",
                  open: this.data.detail.time_open_shop_su,
                  close: this.data.detail.time_close_shop_su
                }
              ];

              this.open_2 = [
                {
                  text: "Montag",
                  open: this.data.detail.time_open_shop_2_mo,
                  close: this.data.detail.time_close_shop_2_mo
                },
                {
                  text: "Dienstag",
                  open: this.data.detail.time_open_shop_2_tu,
                  close: this.data.detail.time_close_shop_2_tu
                },
                {
                  text: "Mittwoch",
                  open: this.data.detail.time_open_shop_2_we,
                  close: this.data.detail.time_close_shop_2_we
                },
                {
                  text: "Donnerstag",
                  open: this.data.detail.time_open_shop_2_th,
                  close: this.data.detail.time_close_shop_2_th
                },
                {
                  text: "Freitag",
                  open: this.data.detail.time_open_shop_2_fr,
                  close: this.data.detail.time_close_shop_2_fr
                },
                {
                  text: "Samstag",
                  open: this.data.detail.time_open_shop_2_sa,
                  close: this.data.detail.time_close_shop_2_sa
                },
                {
                  text: "Sonntag",
                  open: this.data.detail.time_open_shop_2_su,
                  close: this.data.detail.time_close_shop_2_su
                }
              ]

              //this.mess = this.data.detail.dsmart_custom_date[0].open;

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

  newRow(object: any) {
    object.push({
      date: "mo",
      from: "",
      to: ""
    })
  }

}
