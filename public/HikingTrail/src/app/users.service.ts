import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './register/register.component';
import { Credentials } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  private baseUrl: string = "http://localhost:3000/api/users/";

  constructor(private http: HttpClient) { }

  register(user: User):Observable<User>{
    return this.http.post<User>(this.baseUrl, user.json());
  }
  login(user: Credentials): Observable<any>{
    const url = this.baseUrl + "login";
    return this.http.post<Credentials>(url, user.json());
  }
}


