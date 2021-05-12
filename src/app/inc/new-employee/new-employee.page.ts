import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ToastController } from '@ionic/angular';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.page.html',
  styleUrls: ['./new-employee.page.scss'],
})
export class NewEmployeePage implements OnInit {
  id;
  name = "";
  age = "";
  email = "";
  color = "";
  text_color = "";
  status = "work";
  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/employee";
  private head_url = "http://";
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
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
    });
  }



  saveEmployee() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = "/wp-json/bookingtcg/v1/mobile/new/employee";
        let url = this.head_url + shops[index].domain + end_url;
        
        let employee_id = "E" + (Date.now().toString(36) + Math.random().toString(36).substr(2)).substr(10);
        this.http.post(url, {
          access_token: access_token,
          employee_id: employee_id,
          name: this.name,
          age: this.age,
          email: this.email,
          color: this.color,
          text_color: this.text_color,
          status: this.status
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

}
