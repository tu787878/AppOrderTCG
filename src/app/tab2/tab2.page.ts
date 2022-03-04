import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import {
  AlertController,
  IonInfiniteScroll,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { AuthGuardService } from '../services/auth-guard.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  private sub_url = '/wp-json/ordertcg/v1/mobile/get/orders';
  date: string;
  data;
  d;
  mess;
  max_page;
  page = 1;
  type: 'moment'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  von= new Date().toISOString();
  von1 = '';
  bis = '';
  bis1 = '';
  status = '';

  constructor(
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
    private http2: HTTP,
    public alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.getData();
  }

  changeFilter($event) {
    this.getData();
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        if (this.von != '') {
          this.von1 = moment(this.von).format('DD-MM-YYYY');
          this.bis1 = this.von1;
        }

        let url = shops[index].domain + this.sub_url;
        let parameter =
          '?token=' +
          access_token +
          '&date_from=' +
          this.von1 +
          '&date_to=' +
          this.bis1 +
          '&status=' +
          this.status +
          '&paged=' +
          this.page;
          ;
        
        this.mess = parameter;
        this.http2
          .get(url + parameter, {}, {})
          .then((data) => {
            console.log(data);
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);
            //this.mess = dt;
            dt = JSON.parse(dt);

            if (dt.status == 'success') {
              this.data = dt.data;
              this.max_page = this.data.pages;
              //this.mess = this.data.detail.length;
            } else {
              this.authService.setAuthenticated(false);
            }
          })
          .catch((error) => {
            console.log(error);
            
            this.authService.setAuthenticated(false);
          });
      });
    });
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Diese Bestellung löschen?',

      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            this.deleteOrder(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Termin wurde gespeichern',
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

  loadData(event) {
    setTimeout(() => {
      event.target.complete();
      
      if (this.page > this.max_page - 1) {
        event.target.disabled = true;
      } else {
        this.page++;
        console.log(this.page);
        
        this.storage.get('shops').then((shops) => {
          this.storage.get('active_shop').then((index) => {
            let access_token = shops[index].access_token;
    
            if (this.von != '') {
              this.von1 = moment(this.von).format('DD-MM-YYYY');
              this.bis1 = this.von1;
            }
    
            let url = shops[index].domain + this.sub_url;
            let parameter =
              '?token=' +
              access_token +
              '&date_from=' +
              this.von1 +
              '&date_to=' +
              this.bis1 +
              '&status=' +
              this.status +
              '&paged=' +
              this.page;
              ;
            
            this.mess = parameter;
            this.http2
              .get(url + parameter, {}, {})
              .then((data) => {
                console.log(data);
                data.data = data.data.replace("}null", "}");
                let dt = data.data.split('<br />', 1);
                //this.mess = dt;
                dt = JSON.parse(dt);
    
                if (dt.status == 'success') {
                  
                  for (let index = 0; index < dt.data.detail.length; index++) {
                    const element = dt.data.detail[index];
                    this.data.detail.push(element);
                  }
                  
                  //this.mess = this.data.detail.length;
                } else {
                  this.authService.setAuthenticated(false);
                }
              })
              .catch((error) => {
                console.log(error);
                
                this.authService.setAuthenticated(false);
              });
          });
        });
      }
    }, 500);
  }

  deleteOrder(id) {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = '/wp-json/ordertcg/v1/mobile/delete/order';
        let url = shops[index].domain + end_url;

        this.http2
          .post(
            url,
            {
              access_token: access_token,
              order_id: id,
            },
            {}
          )
          .then((data) => {
            console.log(data);
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            this.mess = data[0];
            if (dt.status == 'success') {
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
}
