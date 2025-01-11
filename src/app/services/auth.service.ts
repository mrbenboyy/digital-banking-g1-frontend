import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAutenticated: boolean = false;
  roles: any;
  email: any;
  accessToken!: any;

  constructor(private http: HttpClient, private router: Router) { }

  public Login(email: string, password: string) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }

    let params = { email: email, password: password };
    return this.http.post("http://localhost:8085/auth/login", params, options)
  }
  loadProfile(data: any) {
    this.isAutenticated = true;
    this.accessToken = data['access-token'];
    let decodedJwt: any = jwtDecode(this.accessToken);

    this.email = decodedJwt.sub;
    this.roles = decodedJwt.roles || []; // Make sure roles are set, even if empty

    window.localStorage.setItem('jwt-token', this.accessToken); // Store the token
  }

  Logout() {
    this.isAutenticated = false;
    this.accessToken = undefined;
    this.email = undefined;
    this.roles = undefined;
    window.localStorage.removeItem("jwt-token");
    this.router.navigateByUrl("/login");
  }
  loadJwtTokenFromLocalStorage() {
    let token = window.localStorage.getItem("jwt-token");
    if (token) {
      this.loadProfile({ "access-token": token });
      this.router.navigateByUrl("/admin/customers");
    }
  }
}
