import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { AuthGuardService } from '../services/auth-guard.service';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{
  data: any;
  von = '';
  von1 = '';
  bis = '';
  bis1 = '';
  status = '';
  message;
  message2;
  private sub_url = "/wp-json/ordertcg/v1/mobile/get/dashboard";
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    private http2: HTTP,
  ) {

  }

  ionViewWillEnter() {
    this.getData();
  }

  changeFilter() {
    this.getData();
  }

  public getData() {
    this.data = null;
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        if (shops.length == 0 || shops[index] == undefined) {
          this.authService.setAuthenticated(false);
          this.router.navigate(['login']);
          return;
        }
        let access_token = shops[index].access_token;
        
        if (this.von != '') {
          this.von1 = moment(this.von).format('DD-MM-YYYY');
        }
        if (this.bis != '') {
          this.bis1 = moment(this.bis).format('DD-MM-YYYY');
        }
        
        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token + "&order-status=" + this.status + "&date_from=" + this.von1 + "&date_to=" + this.bis1;
        this.message = parameter;
        this.http2.get(url + parameter, {}, {})
          .then(data => {
            console.log(data);
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
            } else {
              this.authService.setAuthenticated(false);
            }
          })
          .catch(error => {
            this.authService.setAuthenticated(false);
            console.log(error);
          });
      });
    });
  }
}
