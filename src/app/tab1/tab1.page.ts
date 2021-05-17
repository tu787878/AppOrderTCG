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
  bis = '';
  status = 'all';
  message;
  message2;
  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/dashboard";
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
   
    
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        if (shops.length == 0 || shops[index] == undefined) {
          this.authService.setAuthenticated(false);
          this.router.navigate(['login']);
          return;
        }
        let access_token = shops[index].access_token;
        if (this.von != '') {
          this.von = moment(this.von).format('YYYY-MM-DD');
        }
        if (this.bis != '') {
          this.bis = moment(this.bis).format('YYYY-MM-DD');
        }

        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token + "&status=" + this.status + "&von=" + this.von + "&bis=" + this.bis;
        console.log(parameter);

        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
            } else {
              this.authService.setAuthenticated(false);
              this.router.navigate(['login']);
            }
          })
          .catch(error => {

            this.authService.setAuthenticated(false);
            this.router.navigate(['login']);

          });

        /*
        this.http.get(url + parameter,).subscribe((response) => {
          console.log(response);
          
          if (response['status'] == "success") {
            this.data = response['data'];
          } else {
            this.authService.setAuthenticated(false);
            this.router.navigate(['login']);
          }
        });

        */
      });
    });

    
  }

}
