import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  private authenticated: boolean = false;
  constructor(
    private router: Router,
    private storage: Storage,
  ) {
    
  }
  ionViewWillEnter() {
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    
  ): Promise<boolean> {

    return this.storage.get('shops').then(shops => {

      if (shops == null) {
        this.storage.set('shops', []);
        this.router.navigate(['/login']);
        return false;
      }

      if (shops.length > 0) {
        this.authenticated = true;
        return true;
      }
      this.authenticated = false;
      this.router.navigate(['/login']);
      return false;
    });
   
  }

  setAuthenticated(status: boolean) {
    this.authenticated = status;
  }
}
