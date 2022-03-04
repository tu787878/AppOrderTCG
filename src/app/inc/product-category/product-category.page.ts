import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.page.html',
  styleUrls: ['./product-category.page.scss'],
})
export class ProductCategoryPage{
  data: any;
  mess;
  xx;
  suche = '';
  private sub_url = '/wp-json/ordertcg/v1/mobile/get/product_categories';
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    private http2: HTTP,
    public toastController: ToastController
  ) {}
  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.data = null;
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        if (shops.length == 0 || shops[index] == undefined) {
          this.authService.setAuthenticated(false);
          this.router.navigate(['login']);
          return;
        }
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = '?token=' + access_token + '&date_from=' + this.suche;
        console.log(url+parameter);
        
        this.http2
          .get(url + parameter, {}, {})
          .then((data) => {
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            console.log(data);
            
            //this.mess = dt.data.categories.length;
            this.xx = dt.data.test;
            if (dt.status === 'success') {
              this.data = dt.data;
            } else {
              this.authService.setAuthenticated(false);
            }
          })
          .catch((error) => {
            this.authService.setAuthenticated(false);
          });
      });
    });
  }

  

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Produkt wurde aktualisiert!',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal!',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  changeFilter() {
    this.getData();
  }

}
