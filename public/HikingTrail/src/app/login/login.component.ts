import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AtuthenticationService } from '../atuthentication.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm')
  loginForm!: NgForm;

  error: boolean = false;
  errorMessage: string = "";
  constructor(private usersService: UsersService, private authentication: AtuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  login():void{
    let credentials: Credentials = new Credentials();
    credentials.fillFromForm(this.loginForm);
    
    this.usersService.login(credentials).subscribe({
      next: (response)=>{
      this.authentication.token = response.token;
      this.router.navigate([""]);
      },
      error: (err)=>{
        this.error = true;
        this.errorMessage ="Username or Password is not correct";
        setTimeout(()=>{
          this.error = false;
          this.errorMessage="";
        }, 2000);

      }
    }
    )
  }
  

}

export class Credentials{
  
  #_password!: string;
  #_username!: string

  get username(){return this.#_username}
  get password(){return this.#_password}
  
  set username(username){this.#_username = username};
  set password(password){this.#_password = password};
  
  fillFromForm(form: NgForm)
  {
    
    this.username= form.value.username;
    this.password = form.value.password;
  }
  json() :any
  {
    return {
  
      username: this.username,
      password: this.password
    }
  }
  // constructor(username: string, password: string, name: string)
  // {
  //   this.username = username;
  //   this.password = password;
  //   this.name = name; 
  // }
}
