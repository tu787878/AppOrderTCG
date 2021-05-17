import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  new = false;
  name = "";
  data: any;
  private cors = "https://cors-anywhere.herokuapp.com/";

  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/payment_method";
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
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

        let url = this.cors + shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token;

        this.http.get(url + parameter).subscribe((response) => {
          console.log(response);
          
          if (response['status'] == "success") {
            this.data = response['data'];
          } else {
            this.authService.setAuthenticated(false);
          }
        });
      });
    });
  }

  deletePayment(id: string) {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/delete/payment";
        let url = this.cors + shops[index].domain + end_url;

        this.http.post(url, {
          access_token: access_token,
          id: id          
        }).subscribe((response) => {
            console.log(response);
            if(response['status'] == "success"){
              this.toastSuccess();
              this.getData();
            } else {
              this.toastFailed();
            }
        },
          (err) => {
            this.toastFailed();
          }
        );
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

  new_payment() {
    this.new = true;
  }

  save_payment() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/new/payment";
        let url = this.cors + shops[index].domain + end_url;

        this.http.post(url, {
          access_token: access_token,
          name: this.name
        }).subscribe((response) => {
            console.log(response);
            if(response['status'] == "success"){
              this.toastSuccess();
              this.getData();
              this.name = "";
            } else {
              this.toastFailed();
            }
        },
          (err) => {
            this.toastFailed();
          }
        );
      });
    });
  }

}
