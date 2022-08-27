import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TrailsDataService } from '../trails-data.service';
import { Location } from '@angular/common';
import { AtuthenticationService } from '../atuthentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.css']
})
export class AddPlantComponent implements OnInit {

  success: boolean= false;
  error: boolean = false;
  successMessage: string="Plant Added Successfully";
  errorMessage: string = "Failled to add plant";
  plant: Plant = new Plant();
  trailId!: string;
  addPlantForm = new FormGroup({
    name: new FormControl(),
    type: new FormControl(),
    fruit: new FormControl()

  })

  constructor(private _location: Location, private trailDataService: TrailsDataService, private router: ActivatedRoute, private authenticationService: AtuthenticationService, private route: Router) { }

  ngOnInit(): void {
   
      if(!this.authenticationService.isLoggedIn)
      {
        this.route.navigate(["login"]);
      }
    
  }
  back(){
    this._location.back();
  }
  addPlant()
  {
    this.trailId = this.router.snapshot.params["trialId"];
    this.plant.fillFromForm(this.addPlantForm);
    this.trailDataService.addPlant(this.trailId, this.plant).subscribe(
      {
        next: ()=>{
          this.error = false;
          this.success = true;
          this.addPlantForm.reset();
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

export class Plant{
  name!: string;
  plantWithFruit!: boolean;
  type!: string;

  fillFromForm(addPlantForm: FormGroup)
  {
    this.name = addPlantForm.value.name;
    this.plantWithFruit = addPlantForm.value.fruit;
    this.type = addPlantForm.value.type;

  }
  json()
  {
    return {
      name: this.name,
      type: this.type,
      plantWithFruit:this.plantWithFruit

    }
  }
}
