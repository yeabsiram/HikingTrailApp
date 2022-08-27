import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('registerForm')
  registrationForm!: NgForm;

  constructor(private usersService: UsersService) { }
  
  successMessage: string="";
  errorMessage: string="";
  error: boolean= false;
  success: boolean = false;
  passwordMatch: boolean = false;

  ngOnInit(): void {
  }
  register():void
  {
    const newUser: User = new User();
    newUser.fillFromForm(this.registrationForm);
    console.log(this.registrationForm.value);
    if(this.registrationForm.value.password != this.registrationForm.value.rpPassword)
    {
      this.passwordMatch = true;
      setTimeout(()=>{
        this.passwordMatch = false;
      }, 2000);
    }
    else
    {
      this.usersService.register(newUser).subscribe({
        next: ()=>{
          this.error = false;
          this.success = true;
          this.passwordMatch = false;
          this.successMessage ="User registered successfully";
          this.registrationForm.reset();
        },
        error: ()=>{
          this.error = true;
          this.success = false;
          this.successMessage="";
          this.errorMessage="Failed to register user"; 
        }
      });
    }
    
   
  }

}
export class User{
  #_name!: string;
  #_password!: string;
  #_username!: string

  get username(){return this.#_username}
  get password(){return this.#_password}
  get name(){return this.#_name}

  set username(username){this.#_username = username};
  set password(password){this.#_password = password};
  set name(name){this.#_name = name};

  fillFromForm(form: NgForm)
  {
    this.name = form.value.name;
    this.username= form.value.username;
    this.password = form.value.password;
  }
  json() :any
  {
    return {
      name: this.name,
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