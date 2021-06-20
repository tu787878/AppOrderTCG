import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-email-setting',
  templateUrl: './email-setting.page.html',
  styleUrls: ['./email-setting.page.scss'],
})
export class EmailSettingPage implements OnInit {
  data: any;
  private sub_url = "/wp-json/ordertcg/v1/mobile/get/email-setting";
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
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
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
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/ordertcg/v1/mobile/update/email-setting";
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
            this.toastSuccess();
            this.getData();
          } else {
            this.toastFailed(data.status);
          }
        })
        .catch((error) => {
          this.toastFailed(error);
        });
        /*
        this.http.post(url, {
          access_token: access_token,
          detail: this.data.detail
          
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

        */
      });
    });
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Allgemein wurde aktuelieren!',
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

}
