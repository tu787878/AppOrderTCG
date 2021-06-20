import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  data: any;
  mess;
  paypal: boolean;
  klarna: boolean;
  sandbox: boolean;
  methodes = [];

  private sub_url = "/wp-json/ordertcg/v1/mobile/get/payment_method";
  constructor(
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
    private http2: HTTP
  ) {

  }

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

        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
              this.paypal = this.data.detail.dsmart_paypal == "on" ? true : false;
              this.klarna = this.data.detail.dsmart_klarna == "on" ? true : false;
              this.sandbox = this.data.detail.dsmart_sandbox == "yes" ? true : false;
              this.methodes = [];
              for (let index = 0; index < this.data.detail.dsmart_custom_method.length; index++) {
                const element = this.data.detail.dsmart_custom_method[index];
                this.methodes.push({
                  value: element,
                })
              }
            } else {
              this.authService.setAuthenticated(false);
              this.router.navigate(['login']);
            }
          })
          .catch(error => {

            this.authService.setAuthenticated(false);
            this.router.navigate(['login']);

          });
      });
    });
  }

  

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Erfolg!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  save_payment() {

    this.data.detail.dsmart_custom_method = [];
    for (let index = 0; index < this.methodes.length; index++) {
      const element = this.methodes[index];
      
      this.data.detail.dsmart_custom_method.push(element.value)
    }

    this.mess = this.data.detail.dsmart_custom_method;
    this.data.detail.dsmart_paypal = this.paypal ? "on" : "off";
    this.data.detail.dsmart_klarna = this.klarna ? "on" : "off";
    this.data.detail.dsmart_sandbox = this.sandbox ? "yes" : "no";


    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/ordertcg/v1/mobile/update/payment_method";
        let url =  shops[index].domain + end_url;

        this.http2.post(url, {
          access_token: access_token,
          detail: this.data.detail
        }, {})
        .then((data) => {
          console.log(data);
          let dt = data.data.split('<br />', 1);
          dt = JSON.parse(dt);
          if (dt.status == "success") {
            this.getData();
            this.toastSuccess();
          } else {
            this.toastFailed();
          }
        })
        .catch((error) => {
          this.toastFailed();
          this.mess = error;
          
        });
       
      });
    });
  }

  deleteMethod(item) {
    this.methodes = this.methodes.filter(i => i.value != item.value);
  }

  new_method() {
    this.methodes.push({value:""});
  }

}
