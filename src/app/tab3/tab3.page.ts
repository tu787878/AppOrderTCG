import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthGuardService } from '../services/auth-guard.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  data:any;
  private head_url = "http://";
  private sub_url = "/wp-json/bookingtcg/v1/mobile/get/manager";
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthGuardService,
  ) {

  }
  
  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        

        let url = this.head_url + shops[index].domain + this.sub_url;
        let parameter = "?token=" + access_token;

        this.http.get(url + parameter).subscribe((response) => {
          console.log(response);
          
          if (response['status'] == "success") {
            this.data = response['data'];
          } else {
            this.authService.setAuthenticated(false);
          }
        });
      });
    });
  }

}
