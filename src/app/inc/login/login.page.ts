import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private sub_url = "/wp-json/bookingtcg/v1/mobile/auth";
  input = { domain: "http://bookingtcg.local", code: "TCG-koe7inyn" };
  private loading;
  message: string = "";
  constructor(
    public loadingController: LoadingController,
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
  ) 
  { 
    let userTestStatus: { domain: string, shop_name: string, access_token:string, logo:string }[] = [
      
    ];

    this.storage.set('shops', userTestStatus);
  }

  ngOnInit() {
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Bitte warten...',
      duration: 2000
    });
    await this.loading.present();

  }
// bookingtcg.local
// TCG-ko5p4gas	
  addShop(){
    this.presentLoading();
    let domain = this.input['domain']
    let url = domain + this.sub_url;
    let code = this.input['code'];

    this.http.post(url, {
        code: code
    }).subscribe((response) => {
        console.log(response);
        if(response['status'] == "success"){
          this.storage.get('shops').then((val) => {
            let temp: { domain: string, shop_name: string, access_token:string, logo:string } = 
            {
              "domain": domain,
              "shop_name": response['shop_name'],
              "access_token": response['access_token'],
              "logo": response['logo']
            }
              ;
            if (val.length == 0) {
                val.push(temp);
                this.storage.set('shops', val);
                this.storage.set('active_shop', 0);
                this.authService.setAuthenticated(true);
                this.router.navigate(["tabs/tab1"]);
                this.loading.dismiss();
            } else {
              if (val.findIndex((e) => e.domain === domain) == -1) {
                val.push(temp);
                this.storage.set('shops', val);
                this.storage.set('active_shop', val.length - 1);
                this.authService.setAuthenticated(true);
                this.router.navigate(["tabs/tab1"]);
                this.loading.dismiss();
              } else {
                this.authService.setAuthenticated(true);
                this.router.navigate(["tabs/tab1"]);
                this.loading.dismiss();
              }
            }
        });
          
        } else {
          this.message = "Code ist falsch!";
          this.loading.dismiss();
        }
    },
      (err) => {
        this.message = "Domain ist falsch!";
          this.loading.dismiss();
      }
    );
  }

  backToDashboard() {
    this.router.navigate(["tabs/tab1"]);
  }
}
