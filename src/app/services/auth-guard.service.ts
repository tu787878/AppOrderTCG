import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  private authenticated: boolean = true;
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    if (!this.authenticated) {
      this.router.navigate(["login"]);
      return false;
    }

    return true;
  }

  setAuthenticated(status: boolean) {
    this.authenticated = status;
  }
}
