import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.page.html',
  styleUrls: ['./edit-employee.page.scss'],
})
export class EditEmployeePage implements OnInit {
  id;
  data;
  colors = ['#1e81b0', '#eeeee4', '#e28743', '#eab676', '#76b5c5', '#f5595c', '#2d8c44', '#bd4495']
  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/employee";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    public toastController: ToastController,
    private http2: HTTP
  ) {
    
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.getData();
    });
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url =  shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token + "&employee_id=" + this.id;

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


  saveEmployee() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/update/employee";
        let url =  shops[index].domain + end_url;
        
        this.http2.post(url, {
          access_token: access_token,
          employee_id: this.data.detail.employee_id,
          name: this.data.detail.name,
          age: this.data.detail.age,
          email: this.data.detail.email,
          color: this.data.detail.color,
          text_color: this.data.detail.text_color,
          status: this.data.detail.status
        }, {})
        .then((data) => {
          console.log(data);
          let dt = data.data.split('<br />', 1);
          dt = JSON.parse(dt);
          if (dt.status == "success") {
            this.toastSuccess();
              this.router.navigate(['tabs', 'tab3', 'employee']);
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
          employee_id: this.data.detail.employee_id,
          name: this.data.detail.name,
          age: this.data.detail.age,
          email: this.data.detail.email,
          color: this.data.detail.color,
          text_color: this.data.detail.text_color,
          status: this.data.detail.status
        }).subscribe((response) => {
            console.log(response);
            if(response['status'] == "success"){
              this.toastSuccess();
              this.router.navigate(['tabs', 'tab3', 'employee']);
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
      message: 'Mitarbeiter wurde gespeichern!',
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

  toTimeManager(employee_id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.data.detail.employee_id
      }
    };
    console.log(navigationExtras)
    this.router.navigate(['tabs', 'tab3', 'employee', 'edit-employee', 'time-manager'], navigationExtras);
  }

  toServicesManager(employee_id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.data.detail.employee_id
      }
    };
    console.log(navigationExtras)
    this.router.navigate(['tabs', 'tab3', 'employee', 'edit-employee', 'services-manager'], navigationExtras);
  }

  chooseColor(code) {
    this.data.detail.color = code;
  }

  chooseTextColor(code) {
    this.data.detail.text_color = code;
  }


}
