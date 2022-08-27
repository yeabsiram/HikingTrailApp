import { Component, OnInit } from '@angular/core';
import { AtuthenticationService } from '../atuthentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  

  get isLoggedIn()
  {
    return this.authentication.isLoggedIn;
  }
  get name()
  {
    return this.authentication.name;
  }

  constructor(private authentication: AtuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }
  logout(){
    this.authentication.isLoggedIn = false;
    this.authentication.logout();
    this.router.navigate(["login"]);

  }
}
