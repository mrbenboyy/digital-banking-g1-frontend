import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['role']; // Get the required roles from the route data

    // If requiredRoles is a string, convert it to an array
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Check if the user is authenticated and has one of the required roles
    if (this.authService.isAutenticated && roles.some(role => this.authService.roles.includes(role))) {
      return true;
    } else {
      // Redirect to the not authorized page if the user doesn't have access
      this.router.navigateByUrl("/admin/notAuthorized");
      return false;
    }
  }
}
