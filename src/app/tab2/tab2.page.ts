import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CalendarComponentOptions } from 'ion2-calendar'
import * as moment from 'moment';
import { AuthGuardService } from '../services/auth-guard.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/events";
  date: string;
  data;
  d;
  type: 'moment'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarComponentOptions = {
    color: 'primary',
    showMonthPicker: false,
  };

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
  ) { }
  
  changeDate($event) {
    this.d = moment(this.date).format('YYYY-MM-DD');
    this.getData(this.d);
  }

  getData(d:string) {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token + "&date=" + d;

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

  toDetail(event) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: event
      }
    };
    console.log(navigationExtras)
    this.router.navigate(['tabs', 'tab2', 'detail-event'], navigationExtras);
  }

  changeToggle(e:any) {
    
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        if (shops.length == 0 || shops[index] == undefined) {
          this.authService.setAuthenticated(false);
          this.router.navigate(['login']);
          return;
        }
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/update/event";
        let url = shops[index].domain + end_url;
        let action = (e.status === "wait") ? "erledigt" : "wait";
        this.http.post(url, {
          access_token: access_token,
          event_id: e.id,
          action: action
        }).subscribe((response) => {
            console.log(response);
          if (response['status'] == "success") {
            this.getData(this.d);
              this.toastSuccess();
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
}
