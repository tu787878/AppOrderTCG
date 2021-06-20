import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage implements OnInit {

  data: any;
  mess;
  get_distance: boolean;
  currencies = [
    {
      value: "1",
      text: '$'
    },
    {
      value: "2",
      text: '€'
    },
    {
      value: "3",
      text: 'CHF'
    }
  ];
  orderby = [
    "date",
    "name",
    "id",
    "slug",
    "title_number"
  ];
  sortart = [
    {
      value: "desc",
      text: "DESC"
    },
    {
      value: "asc",
      text: "ASC"
    },
  ]

  colors = ['#1e81b0', '#eeeee4', '#e28743', '#eab676', '#76b5c5', '#f5595c', '#2d8c44', '#bd4495', '#DBFF33',
  '#33FFBD', '#BC7869', '#69BCA2', '#BC7E69', '#7E69BC', '#8334B9', '#B9343C']
  private sub_url = "/wp-json/ordertcg/v1/mobile/get/general";
  constructor(
    private http: HttpClient,
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

        let url =  shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token;

        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
              this.get_distance = this.data.detail.get_distance == "on" ? true : false;
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
    this.data.detail.get_distance = this.get_distance ? "on" : "off";
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/ordertcg/v1/mobile/update/general";
        let url =  shops[index].domain + end_url;
        
        this.http2.post(url, {
          access_token: access_token,
          detail: this.data.detail
        }, {})
        .then((data) => {
          console.log(data);
          let dt = data.data.split('<br />', 1);
          this.mess = dt;
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
          this.mess = error;
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

  chooseColor(code) {
    this.data.detail.shop_color = code;
  }


}
