import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-time-shop',
  templateUrl: './time-shop.page.html',
  styleUrls: ['./time-shop.page.scss'],
})
export class TimeShopPage implements OnInit {
  data;
  off = new Array();
  currentCount = 0;
  day = [
    
    {
      index: 1,
      label: 'Montag'
    },
    {
      index: 2,
      label: 'Dienstag'
    },
    {
      index: 3,
      label: 'Mittwoch'
    },
    {
      index: 4,
      label: 'Donnerstag'
    },
    {
      index: 5,
      label: 'Freitag'
    },
    {
      index: 6,
      label: 'Samstag'
    },
    {
      index: 0,
      label: 'Sonntag'
    },
  ]

  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/shop_times";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    public toastController: ToastController,
  ) {
    
  }

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token;;

        this.http.get(url + parameter).subscribe((response) => {
          console.log(response);
          if (response['status'] == "success") {
            this.data = response['data'];
            for (let i = 0; i < 7; i++){
              for (let j = 0; j < this.data.detail.length; j++){
                let e = this.data.detail[j];
                if (e.day_of_week == "" + i) {
                  this.off[i] = e.off_day == "1" ? true:false;
                  j = this.data.detail.lengt;
                } 
              }
            }
            console.log(this.off);
          } else {
            this.authService.setAuthenticated(false);
          }
        });
      });
    });
  }

  saveTimes() {
   

    this.data.detail = this.data.detail.filter(element => {
      if (element.start_time === element.end_time || element.start_time > element.end_time) {
        return false;
      }
      return true;
    });
    
    for (let i = 0; i < 7; i++){
      for (let j = 0; j < this.data.detail.length; j++){
        let e = this.data.detail[j];
        if (e.day_of_week == "" + i) {
          e.off_day = this.off[i] ? "1":"0";
          j = this.data.detail.lengt;
        } 
      }
    }
    
    console.log(this.data.detail);
    
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/update/shop_times";
        let url = shops[index].domain + end_url;
        this.http.post(url, {
          access_token: access_token,
          times: this.data.detail

        }).subscribe((response) => {
            console.log(response);
            if(response['status'] == "success"){
              this.toastSuccess();
              this.router.navigate(['tabs', 'tab4']);
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
      message: 'Zeiten wurde gespeichern!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal!',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
  ngOnInit() {
  }

  new_period(day_of_week) {
    this.data.detail.push(
      {
        day_of_week: "" + day_of_week,
        start_time: "00:00:00",
        end_time: "00:00:00",
        off_day: this.off[day_of_week],
        id: "new_" + this.currentCount++
      });
    
    console.log(this.data.detail);
  }

  deletePeriod(id) {
    this.data.detail = this.data.detail.filter(element => element.id != id);
  }

  blitz() {
    console.log(this.data.shop_time);
    this.data.detail = [];

    this.data.shop_time.forEach(element => {
      this.data.detail.push(element);
    });
  }

}
