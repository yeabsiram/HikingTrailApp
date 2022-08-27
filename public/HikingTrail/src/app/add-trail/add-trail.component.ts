import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AtuthenticationService } from '../atuthentication.service';
import { TrailsDataService } from '../trails-data.service';
import { Trail } from '../trails/trails.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-trail',
  templateUrl: './add-trail.component.html',
  styleUrls: ['./add-trail.component.css']
})
export class AddTrailComponent implements OnInit {

  constructor(private trailsDataService: TrailsDataService, private router: Router, private authenticate: AtuthenticationService) { }
  @ViewChild('addTrailForm')
  addTrailForm!: NgForm;

  successMessage: string = "Trail succesfully created";
  errorMessage: string = "Failed to create trail";
  error: boolean =false;
  success: boolean = false;
  ngOnInit(): void {
    if(!this.authenticate.isLoggedIn)
    {
      this.router.navigate(["login"]);
    }
  }

  addTrail():void{
    let trail: Trail = new Trail();
    console.log(this.addTrailForm)
    trail.fillFromForm(this.addTrailForm);
   
    this.trailsDataService.addOne(trail).subscribe({
      next: (response)=>{
            this.success= true;
            this.error = false;
            this.addTrailForm.reset();
            setTimeout(()=>{
              this.success = false;
              
            }, 3000);
      },
      error: (error) =>{
            this.error = true;
            this.success = false;
            setTimeout(()=>{
              this.error = false;
            }, 3000);

      }
    })

  }

}
