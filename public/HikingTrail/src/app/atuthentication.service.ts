import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtuthenticationService {

  #_isLoggedIn: boolean = false;
 
  get isLoggedIn() {return this.#_isLoggedIn};
  set isLoggedIn(isLoggedIn) { this.#_isLoggedIn = isLoggedIn};

  set token(token){
    localStorage.setItem(environment.token_storage_key, token as string);
    this.isLoggedIn = true;
  };
  get token(){return localStorage.getItem(environment.token_storage_key)};

  get name()
  {
    let name: string = "";
    if(this.token)
    {
      name = this.jwtService.decodeToken(this.token).name;
    }
    return name;
  }
  logout():void{
    localStorage.clear();
  }
  constructor(private jwtService: JwtHelperService) { }
}
