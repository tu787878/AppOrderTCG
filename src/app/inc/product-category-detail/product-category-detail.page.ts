import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController } from '@ionic/angular';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { Storage } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
@Component({
  selector: 'app-product-category-detail',
  templateUrl: './product-category-detail.page.html',
  styleUrls: ['./product-category-detail.page.scss'],
})
export class ProductCategoryDetailPage {
  orderId = null;
  images = null;
  imageResponse: any = [];
  options: any;
  base;
  img2;
  private sub_url = '/wp-json/ordertcg/v1/mobile/get/detail_product_category';
  data;
  mess;
  mess2;
  dateArray = [];
  openArray = [];
  closeArray = [];

  day_of_week = [
    {
      text: 'Montag',
      value: 'mo',
    },
    {
      text: 'Dienstag',
      value: 'tu',
    },
    {
      text: 'Mittwoch',
      value: 'we',
    },
    {
      text: 'Donnerstag',
      value: 'th',
    },
    {
      text: 'Freitag',
      value: 'fr',
    },
    {
      text: 'Samstag',
      value: 'sa',
    },
    {
      text: 'Sonntag',
      value: 'su',
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: Storage,
    private authService: AuthGuardService,
    private router: Router,
    public toastController: ToastController,
    private http2: HTTP,
    private imagePicker: ImagePicker,
    private base64: Base64
  ) {}

  ionViewWillEnter() {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.getData();
  }

  getData() {
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;

        let url = shops[index].domain + this.sub_url;
        let parameter =
          '?token=' + access_token + '&categoryId=' + this.orderId;

        this.http2
          .get(url + parameter, {}, {})
          .then((data) => {
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);

            dt = JSON.parse(dt);
            this.mess = dt.data;
            this.mess2 = dt.data;
            if (dt.status === 'success') {
              this.data = dt.data;
              console.log(this.data);
              this.mess = this.data.detail.shipping_method;
              console.log(this.data.item);

              this.data.item = Object.keys(this.data.item).map(
                (x) => this.data.item[x]
              );
              console.log(this.data.item);
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
      message: 'Kategorie wurde aktualisiert!',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async toastFailed() {
    const toast = await this.toastController.create({
      message: 'Fehler! Bitte versuchen Sie noch mal',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  save() {
    this.dateArray = [];
    this.openArray = [];
    this.closeArray = [];
    this.data.tax_time.forEach((element) => {
      this.dateArray.push(element.date);
      this.openArray.push(element.open);
      this.closeArray.push(element.close);
    });
    //this.mess = this.data.detail.zipcode_data.length;
    this.storage.get('shops').then((shops) => {
      this.storage.get('active_shop').then((index) => {
        let access_token = shops[index].access_token;
        let end_url = '/wp-json/ordertcg/v1/mobile/update/product_category';
        let url = shops[index].domain + end_url;
        this.http2
          .post(
            url,
            {
              access_token: access_token,
              categoryId: this.orderId,
              categoryName: this.data.name,
              categoryPosition: this.data.category_pos,
              categoryImage: this.data.term_image,
              pool: this.data.pool,
              dateArray: this.dateArray,
              openArray: this.openArray,
              closeArray: this.closeArray,
              imageData: this.imageResponse[0],
            },
            {}
          )
          .then((data) => {
            console.log(data);
            data.data = data.data.replace("}null", "}");
            let dt = data.data.split('<br />', 1);
            dt = JSON.parse(dt);
            this.mess = data[0];
            if (dt.status == 'success') {
              this.imageResponse = [];
              this.toastSuccess();
              this.getData();
            } else {
              this.toastFailed();
            }
          })
          .catch((error) => {
            this.toastFailed();
          });
      });
    });
  }

  newRow2(object) {
    object.push({
      date: 'mo',
      open: '00:00',
      close: '00:00',
    });
  }

  deleteRow(data, index) {
    data.splice(index, 1);
  }

  getImages() {
    this.options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      maximumImagesCount: 1,

      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      // width: 400,
      // height: 400,

      // quality of resized image, defaults to 100
      // quality: 25,

      // output type, defaults to FILE_URIs.
      // available options are 
      // window.imagePicker.OutputType.FILE_URI (0) or 
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 1
    };
    this.imageResponse = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < results.length; i++) {
        this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
      }
    }, (err) => {
      alert(err);
    });
  }

  onCountryChaged(event): void {
    console.log(event.detail.value);
    this.data.pool = event.detail.value;
  }

}
