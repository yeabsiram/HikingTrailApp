import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TrailsDataService } from '../trails-data.service';
import { Location } from '@angular/common';
import { AtuthenticationService } from '../atuthentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-wildlife',
  templateUrl: './add-wildlife.component.html',
  styleUrls: ['./add-wildlife.component.css']
})
export class AddWildlifeComponent implements OnInit {

  success: boolean= false;
  error: boolean = false;
  successMessage: string="WildLife Added Successfully";
  errorMessage: string = "Failled to add wildlife";
  trailId!: string; 
  wildlife: WildLife = new WildLife();
  
  addWildLifeForm = new FormGroup({
    name: new FormControl(),
    type: new FormControl(),
    isDangerous: new FormControl()

  })

  

  constructor(private _location: Location, private router: ActivatedRoute, private trailDataService: TrailsDataService, private authenticationService: AtuthenticationService, private route: Router) { }

  ngOnInit(): void {
    if(!this.authenticationService.isLoggedIn)
      {
        this.route.navigate(["login"]);
      }
  }

  back()
  {
    this._location.back();
  }
  addWildLife():void{
    this.trailId = this.router.snapshot.params["trialId"];
    this.wildlife.fillFromForm(this.addWildLifeForm);
    this.trailDataService.addWildlife(this.trailId, this.wildlife).subscribe(
      {
        next: (response)=>{
          this.error = false;
          this.success = true;
          this.addWildLifeForm.reset();
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
      }
    );
}

}
export class WildLife{
  name!: string;
  type!: string;
  isDangerous!: boolean;



  fillFromForm(addWildLifeForm: FormGroup)
  {
    this.name = addWildLifeForm.value.name;
    this.isDangerous = addWildLifeForm.value.isDangerous;
    this.type = addWildLifeForm.value.type;

  }
  json()
  {
    return {
      name: this.name,
      type: this.type,
      isDangerous:this.isDangerous

    }
  }

}