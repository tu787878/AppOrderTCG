import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  data: any;
  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/employees";
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
    private http2:HTTP
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
            } else {
              this.authService.setAuthenticated(false);
              this.toastFailed();
              this.router.navigate(['login']);
            }
          })
          .catch(error => {
            this.authService.setAuthenticated(false);
            this.toastFailed();
            this.router.navigate(['login']);
            
          });
      });
    });
  }

  deleteEmployee(id: string) {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/delete/employee";
        let url = shops[index].domain + end_url;

        this.http2.post(url, {
          access_token: access_token,
          employee_id: id
        }, {})
        .then((data) => {
          console.log(data);
          let dt = data.data.split('<br />', 1);
          dt = JSON.parse(dt);
          if (dt.status == "success") {
            this.toastSuccess();
              this.getData();
          } else {
            this.toastFailed();
          }
        })
        .catch((error) => {
          this.toastFailed();
        });
        /*
        this.http.post(url, {
          access_token: access_token,
          employee_id: id,
          
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

  toDetails(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    console.log(navigationExtras)
    this.router.navigate(['tabs', 'tab3', 'employee', 'edit-employee'], navigationExtras);
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Mitarbeiter wurde gelöscht',
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
