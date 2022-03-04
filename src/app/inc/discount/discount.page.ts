import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
@Component({
  selector: 'app-discount',
  templateUrl: './discount.page.html',
  styleUrls: ['./discount.page.scss'],
})
export class DiscountPage implements OnInit {
  data: any;
  mess;
  lieferung;
  abholung;
  private sub_url = "/wp-json/ordertcg/v1/mobile/get/discount";
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
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

        let url =  shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token;

        this.http2.get(url + parameter, {}, {})
          .then(data => {
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;

              this.lieferung = [
                {
                  text: "Montag",
                  time: this.data.detail.time_discount_shop_mo,
                },
                {
                  text: "Dienstag",
                  time: this.data.detail.time_discount_shop_tu,
                },
                {
                  text: "Mittwoch",
                  time: this.data.detail.time_discount_shop_we
                },
                {
                  text: "Donnerstag",
                  time: this.data.detail.time_discount_shop_th
                },
                {
                  text: "Freitag",
                  time: this.data.detail.time_discount_shop_fr
                },
                {
                  text: "Samstag",
                  time: this.data.detail.time_discount_shop_sa
                },
                {
                  text: "Sonntag",
                  time: this.data.detail.time_discount_shop_su
                }
              ];

              this.abholung = [
                {
                  text: "Montag",
                  time: this.data.detail.time_discount_shop_2_mo,
                },
                {
                  text: "Dienstag",
                  time: this.data.detail.time_discount_shop_2_tu,
                },
                {
                  text: "Mittwoch",
                  time: this.data.detail.time_discount_shop_2_we
                },
                {
                  text: "Donnerstag",
                  time: this.data.detail.time_discount_shop_2_th
                },
                {
                  text: "Freitag",
                  time: this.data.detail.time_discount_shop_2_fr
                },
                {
                  text: "Samstag",
                  time: this.data.detail.time_discount_shop_2_sa
                },
                {
                  text: "Sonntag",
                  time: this.data.detail.time_discount_shop_2_su
                }
              ];
            } else {
              this.authService.setAuthenticated(false);
              this.toastFailed(data.data);
              //this.router.navigate(['login']);
            }
          })
          .catch(error => {
            this.authService.setAuthenticated(false);
            this.toastFailed(error);
            //this.router.navigate(['login']);
            
          });
      });
    });
  }

  saveGeneral() {
    //this.mess = this.data.detail.zipcode_data.length;
    
    this.data.detail.time_discount_shop_mo = this.lieferung[0].time;
    this.data.detail.time_discount_shop_tu = this.lieferung[1].time;
    this.data.detail.time_discount_shop_we = this.lieferung[2].time;
    this.data.detail.time_discount_shop_th = this.lieferung[3].time;
    this.data.detail.time_discount_shop_fr = this.lieferung[4].time;
    this.data.detail.time_discount_shop_sa = this.lieferung[5].time;
    this.data.detail.time_discount_shop_su = this.lieferung[6].time;

    this.data.detail.time_discount_shop_2_mo = this.abholung[0].time;
    this.data.detail.time_discount_shop_2_tu = this.abholung[1].time;
    this.data.detail.time_discount_shop_2_we = this.abholung[2].time;
    this.data.detail.time_discount_shop_2_th = this.abholung[3].time;
    this.data.detail.time_discount_shop_2_fr = this.abholung[4].time;
    this.data.detail.time_discount_shop_2_sa = this.abholung[5].time;
    this.data.detail.time_discount_shop_2_su = this.abholung[6].time;


    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/ordertcg/v1/mobile/update/discount";
        let url =  shops[index].domain + end_url;
        
        this.http2.post(url, {
          access_token: access_token,
          detail: this.data.detail
        }, {})
        .then((data) => {
          
          data.data = data.data.replace("}null", "}");
          let dt = data.data.split('<br />', 1);
          console.log(dt);
          dt = JSON.parse(dt);
          this.mess = data[0];
          if (dt.status == "success") {
            this.toastSuccess();
            this.getData();
          } else {
            this.toastFailed(data);
          }
        })
          .catch((error) => {
          console.log(error);
          
          this.toastFailed(error);
        });
      });
    });
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Alles wurde aktuelieren!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async toastFailed(err) {
    const toast = await this.toastController.create({
      message: `Fehler! Bitte versuchen Sie noch mal: ${err}`,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  newRow(object: any) {
    object.push({
      date: "",
      time: "",
    })
  }

  deleteRow(data, index) {
    data.splice(index, 1);
  }

}