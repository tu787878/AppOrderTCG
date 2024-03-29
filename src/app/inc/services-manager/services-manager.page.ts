import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-services-manager',
  templateUrl: './services-manager.page.html',
  styleUrls: ['./services-manager.page.scss'],
})
export class ServicesManagerPage implements OnInit {
  id;
  data: any;
  xxx = false;
  arr = new Array();
  arrData = new Array();
  mess;

  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/employee_service";
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private http2:HTTP
  ) {

  }

  ngOnInit() {
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

        let url = shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token + "&employee_id=" + this.id;

        this.http2.get(url + parameter, {}, {})
          .then(data => {
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            if (dt.status == "success") {
              this.data = dt.data;
              for (let index = 0; index < this.data.service.length; index++) {
                const element = this.data.service[index];
  
                this.arrData.push({
                  index: index,
                  data: element
                })
                this.arr[index] = false;
                for (let i = 0; i < this.data.detail.length; i++) {
                  const e = this.data.detail[i];
                  if (e.service_id == element.service_id) {
                    this.arr[index] = true;
                    break;
                  }
                }
  
              }
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
        /*
        this.http.get(url + parameter).subscribe((response) => {
          console.log(response);
          
          if (response['status'] == "success") {
            this.data = response['data'];

            for (let index = 0; index < this.data.service.length; index++) {
              const element = this.data.service[index];

              this.arrData.push({
                index: index,
                data: element
              })
              this.arr[index] = false;
              for (let i = 0; i < this.data.detail.length; i++) {
                const e = this.data.detail[i];
                if (e.service_id == element.service_id) {
                  this.arr[index] = true;
                  break;
                }
              }

            }
          } else {
            this.authService.setAuthenticated(false);
            this.router.navigate(['login']);
          }
        });
        */
      });
    });
  }

  async toastSuccess() {
    const toast = await this.toastController.create({
      message: 'Service wurde gelöscht',
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

  saveServices() {
    console.log(this.arr);
    this.data.detail = [];

    for (let index = 0; index < this.arrData.length; index++) {
      const element = this.arrData[index];
      if (this.arr[index]) {
        this.data.detail.push(element.data.service_id);
      }
    }
     
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/update/employee_service";
        let url = shops[index].domain + end_url;
        
        this.http2.post(url, {
          access_token: access_token,
          employee_id: this.data.employee.employee_id,
          services: this.data.detail
        }, {})
        .then((data) => {
          console.log(data);
          let dt = data.data.split('<br />', 1);
          this.mess = dt;
          dt = JSON.parse(dt);
          if (dt.status == "success") {
            this.toastSuccess();
              //this.router.navigate(['tabs', 'tab3', 'employee']);
          } else {
            this.toastFailed();
          }
        })
        .catch((error) => {
          this.toastFailed();
          this.mess = error;
        });
        /*
        this.http.post(url, {
          access_token: access_token,
          employee_id: this.data.employee.employee_id,
          services: this.data.detail

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

  blitz() {
    console.log("ok");
    
    for (let index = 0; index < this.arr.length; index++) {
      if (this.xxx) {
        this.arr[index] = true;
      } else {
        this.arr[index] = false;
      }
    }
    this.xxx = !this.xxx;

  }
}
