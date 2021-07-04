import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { IonInfiniteScroll, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { AuthGuardService } from '../services/auth-guard.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  private sub_url = "/wp-json/ordertcg/v1/mobile/get/orders";
  date: string;
  data;
  d;
  mess;
  max_page;
  page = 0;
  type: 'moment'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  
  von = '';
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
  ) { }

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
        }
        if (this.bis != '') {
          this.bis1 = moment(this.bis).format('DD-MM-YYYY');
        }

       
        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token + "&date_from=" + this.von1 + "&date_to=" + this.bis1 + "&status=" + this.status;
        this.mess = parameter;
        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            //this.mess = dt;
            dt = JSON.parse(dt);
            
            if (dt.status == "success") {
              this.data = dt.data;
              this.max_page = this.data.pages;
              //this.mess = this.data.detail.length;
            } else {
              this.authService.setAuthenticated(false);
            }
          })
          .catch(error => {
            this.authService.setAuthenticated(false);
          });
      });
    });
  }

  toDetail(event) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: event
      }
    };
    console.log(navigationExtras)
    this.router.navigate(['tabs', 'tab2', 'detail-event'], navigationExtras);
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Termin wurde gespeichern',
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

  loadData(event) {
      setTimeout(() => {
        event.target.complete();
        this.page++;
        if (this.page > this.max_page) {
          event.target.disabled = true;
        }
      }, 500);
  }
}
