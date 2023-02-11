import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import * as moment from 'moment';
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
  enable_pool;
  dsmart_min_order_free_checkbox;
  mess;
  custom = [];

  open_1 = [];
  open_2 = [];
  shipping = [];

  day_of_week = [
    {
      text: 'Montag',
      value: 'mo',
    },
    {
      text: 'Dienstag',
      value: 'tu',
    },
    {
      text: 'Mittwoch',
      value: 'we',
    },
    {
      text: 'Donnerstag',
      value: 'th',
    },
    {
      text: 'Freitag',
      value: 'fr',
    },
    {
      text: 'Samstag',
      value: 'sa',
    },
    {
      text: 'Sonntag',
      value: 'su',
    },
  ];

  private sub_url = '/wp-json/ordertcg/v1/mobile/get/delivery';
  constructor(
    private router: Router,
    private storage: Storage,
    private authService: AuthGuardService,
    public toastController: ToastController,
    private http2: HTTP
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = '?token=' + access_token;
        console.log(url + parameter);

        this.http2
          .get(url + parameter, {}, {})
          .then((data) => {
            console.log("hihihi");
            
            let dt = this.convertResult(data.data);
            if (dt.status === 'success') {
              this.data = dt.data;
              this.dsmart_method_ship =
                this.data.detail.dsmart_method_ship == 'on' ? true : false;
              this.enable_pool =
                this.data.detail.enable_pool == '1' ? true : false;
                this.dsmart_min_order_free_checkbox=this.data.detail.dsmart_min_order_free_checkbox == "1" ? true : false;
              this.dsmart_method_direct =
                this.data.detail.dsmart_method_direct == 'on' ? true : false;
              this.close_shop =
                this.data.detail.close_shop == 'on' ? true : false;
              if (this.data.detail.dsmart_custom_date === '') {
                this.data.detail.dsmart_custom_date = [];
              }
              if (this.data.detail.dsmart_new_custom_date === '') {
                this.data.detail.dsmart_new_custom_date = [];
              }
              
              this.data.detail.dsmart_new_custom_date.forEach((element) => {
                element.start_date = moment(element.start_date, "DD-MM-YYYY").toISOString();
                element.end_date = moment(element.end_date, "DD-MM-YYYY").toISOString();
              });

              // console.log(this.data.detail.dsmart_new_custom_date);
              // console.log(this.data.detail.dsmart_custom_date);
              

              this.shipping = [];
              for (
                let i = 0;
                i < this.data.detail.dsmart_shipping_to.length;
                i++
              ) {
                let a = {
                  from: this.data.detail.dsmart_shipping_to[i],
                  to: this.data.detail.dsmart_shipping_from[i],
                  fee: this.data.detail.dsmart_shipping_cs_fee[i],
                  min: this.data.detail.dsmart_min_cs_fee[i],
                };
                this.shipping.push(a);
              }

              this.open_1 = [
                {
                  text: 'Montag',
                  open:
                    this.data.detail.time_open_shop_mo === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_mo,
                  close:
                    this.data.detail.time_close_shop_mo === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_mo,
                },
                {
                  text: 'Dienstag',
                  open:
                    this.data.detail.time_open_shop_tu === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_tu,
                  close:
                    this.data.detail.time_close_shop_tu === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_tu,
                },
                {
                  text: 'Mittwoch',
                  open:
                    this.data.detail.time_open_shop_we === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_we,
                  close:
                    this.data.detail.time_close_shop_we === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_we,
                },
                {
                  text: 'Donnerstag',
                  open:
                    this.data.detail.time_open_shop_th === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_th,
                  close:
                    this.data.detail.time_close_shop_th === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_th,
                },
                {
                  text: 'Freitag',
                  open:
                    this.data.detail.time_open_shop_fr === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_fr,
                  close:
                    this.data.detail.time_close_shop_fr === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_fr,
                },
                {
                  text: 'Samstag',
                  open:
                    this.data.detail.time_open_shop_sa === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_sa,
                  close:
                    this.data.detail.time_close_shop_sa === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_sa,
                },
                {
                  text: 'Sonntag',
                  open:
                    this.data.detail.time_open_shop_su === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_su,
                  close:
                    this.data.detail.time_close_shop_su === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_su,
                },
              ];

              this.open_2 = [
                {
                  text: 'Montag',
                  open:
                    this.data.detail.time_open_shop_2_mo === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_2_mo,
                  close:
                    this.data.detail.time_close_shop_2_mo === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_2_mo,
                },
                {
                  text: 'Dienstag',
                  open:
                    this.data.detail.time_open_shop_2_tu === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_2_tu,
                  close:
                    this.data.detail.time_close_shop_2_tu === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_2_tu,
                },
                {
                  text: 'Mittwoch',
                  open:
                    this.data.detail.time_open_shop_2_we === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_2_we,
                  close:
                    this.data.detail.time_close_shop_2_we === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_2_we,
                },
                {
                  text: 'Donnerstag',
                  open:
                    this.data.detail.time_open_shop_2_th === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_2_th,
                  close:
                    this.data.detail.time_close_shop_2_th === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_2_th,
                },
                {
                  text: 'Freitag',
                  open:
                    this.data.detail.time_open_shop_2_fr === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_2_fr,
                  close:
                    this.data.detail.time_close_shop_2_fr === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_2_fr,
                },
                {
                  text: 'Samstag',
                  open:
                    this.data.detail.time_open_shop_2_sa === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_2_sa,
                  close:
                    this.data.detail.time_close_shop_2_sa === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_2_sa,
                },
                {
                  text: 'Sonntag',
                  open:
                    this.data.detail.time_open_shop_2_su === ''
                      ? '00:00'
                      : this.data.detail.time_open_shop_2_su,
                  close:
                    this.data.detail.time_close_shop_2_su === ''
                      ? '00:00'
                      : this.data.detail.time_close_shop_2_su,
                },
              ];

              //this.mess = this.data.detail.dsmart_custom_date[0].open;
            } else {
              this.authService.setAuthenticated(false);
              this.toastFailed();
              this.router.navigate(['login']);
            }
          })
          .catch((error) => {
            console.log(error);

            this.authService.setAuthenticated(false);
            this.toastFailed();
            this.router.navigate(['login']);
          });
      });
    });
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Alles wurde gespeichern!',
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

  newRow(object: any) {
    object.push({
      date: 'mo',
      from: '00:00',
      to: '00:00',
    });
    console.log(object);
  }

  newRow2(object) {
    object.push({
      status: 'open',
      date_type: 'single',
      start_date: moment().toISOString(),
      end_date: moment().toISOString(),
      time_type: 'time_to_time',
      start_time: '00:00',
      end_time: '00:00',
    });
  }

  newRow3(object) {
    object.push({
      from: '',
      to: '',
      fee: '',
      min: '',
    });
  }

  save() {
    this.data.detail.time_open_shop_mo = this.open_1[0].open;
    this.data.detail.time_close_shop_mo = this.open_1[0].close;

    this.data.detail.time_open_shop_tu = this.open_1[1].open;
    this.data.detail.time_close_shop_tu = this.open_1[1].close;

    this.data.detail.time_open_shop_we = this.open_1[2].open;
    this.data.detail.time_close_shop_we = this.open_1[2].close;

    this.data.detail.time_open_shop_th = this.open_1[3].open;
    this.data.detail.time_close_shop_th = this.open_1[3].close;

    this.data.detail.time_open_shop_fr = this.open_1[4].open;
    this.data.detail.time_close_shop_fr = this.open_1[4].close;

    this.data.detail.time_open_shop_sa = this.open_1[5].open;
    this.data.detail.time_close_shop_sa = this.open_1[5].close;

    this.data.detail.time_open_shop_su = this.open_1[6].open;
    this.data.detail.time_close_shop_su = this.open_1[6].close;

    //******************************************** */

    this.data.detail.time_open_shop_2_mo = this.open_2[0].open;
    this.data.detail.time_close_shop_2_mo = this.open_2[0].close;

    this.data.detail.time_open_shop_2_tu = this.open_2[1].open;
    this.data.detail.time_close_shop_2_tu = this.open_2[1].close;

    this.data.detail.time_open_shop_2_we = this.open_2[2].open;
    this.data.detail.time_close_shop_2_we = this.open_2[2].close;

    this.data.detail.time_open_shop_2_th = this.open_2[3].open;
    this.data.detail.time_close_shop_2_th = this.open_2[3].close;

    this.data.detail.time_open_shop_2_fr = this.open_2[4].open;
    this.data.detail.time_close_shop_2_fr = this.open_2[4].close;

    this.data.detail.time_open_shop_2_sa = this.open_2[5].open;
    this.data.detail.time_close_shop_2_sa = this.open_2[5].close;

    this.data.detail.time_open_shop_2_su = this.open_2[6].open;
    this.data.detail.time_close_shop_2_su = this.open_2[6].close;

    /***************************************************** */

    this.data.detail.dsmart_method_ship = this.dsmart_method_ship
      ? 'on'
      : 'off';
      this.data.detail.enable_pool = this.enable_pool
      ? '1'
      : '0';
      this.data.detail.dsmart_min_order_free_checkbox=this.dsmart_min_order_free_checkbox?'1':'0';
    this.data.detail.dsmart_method_direct = this.dsmart_method_direct
      ? 'on'
      : 'off';
    this.data.detail.close_shop = this.close_shop ? 'on' : 'off';

    /******************************************************** */

    this.data.detail.dsmart_shipping_to = [];
    this.data.detail.dsmart_shipping_from = [];
    this.data.detail.dsmart_shipping_cs_fee = [];
    this.data.detail.dsmart_min_cs_fee = [];

    for (let i = 0; i < this.shipping.length; i++) {
      this.data.detail.dsmart_shipping_to[i] = this.shipping[i].to;
      this.data.detail.dsmart_shipping_from[i] = this.shipping[i].from;
      this.data.detail.dsmart_shipping_cs_fee[i] = this.shipping[i].fee;
      this.data.detail.dsmart_min_cs_fee[i] = this.shipping[i].min;
    }


    this.data.detail.dsmart_new_custom_date.forEach((element) => {
      element.start_date = moment(element.start_date).format("DD-MM-YYYY");
      element.end_date = moment(element.end_date).format("DD-MM-YYYY");
    });

    // console.log(this.data.detail.dsmart_new_custom_date);
    
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = '/wp-json/ordertcg/v1/mobile/update/delivery';
        let url = shops[index].domain + end_url;

        this.http2
          .post(
            url,
            {
              access_token: access_token,
              detail: this.data.detail,
            },
            {}
          )
          .then((data) => {
            console.log(data);
            data.data = data.data.replace('}null', '}');
            let dt = data.data.split('<br />', 1);
            console.log(dt);
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

  deleteRow(data, index) {
    data.splice(index, 1);
  }

  convertResult(data) {
    data = data.replace('}null', '}');
    let dt = data.split('<br />', 1);
    dt = JSON.parse(dt);
    return dt;
  }
}
