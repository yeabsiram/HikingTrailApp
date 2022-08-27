import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrailsDataService } from '../trails-data.service';
import { Trail } from '../trails/trails.component';
import { Location } from '@angular/common';
import { AtuthenticationService } from '../atuthentication.service';

@Component({
  selector: 'app-edit-trail',
  templateUrl: './edit-trail.component.html',
  styleUrls: ['./edit-trail.component.css']
})
export class EditTrailComponent implements OnInit {

  @ViewChild('editTrailForm')
  editTrailForm!: NgForm;

  trail: Trail = new Trail();
  updatedTrail: Trail  = new Trail();
  trailId = this.route.snapshot.params["trailId"];
  success: boolean = false;
  error: boolean = false;
  successMessage: string = "Trail updated successfully";
  errorMessage: string = "Failed to update trail";
  
  constructor(private route: ActivatedRoute, private locate: Location, private trailData: TrailsDataService, private _location: Location, private router: Router, private authenticationService: AtuthenticationService) { }

  ngOnInit(): void {
    if(!this.authenticationService.isLoggedIn)
    {
      this.router.navigate(["login"]);
    }
    else
    {
      this.trailData.getOne(this.trailId).subscribe((trail) =>
      {
        this.trail = trail;
        this._fillFromData(this.trail);
      })
    }

   
  }

  back(){
    this._location.back();
  }

  editTrail()
  {
    this.updatedTrail.fillFromForm(this.editTrailForm);
    this.trailData.patchTrail(this.trailId, this.updatedTrail).subscribe(
      {
        next: (response)=>{
              this.success = true;
              this.error= false;
              this.editTrailForm.reset();
              setTimeout(()=>{
                this.success = false;
                this.locate.back();
              }, 2000);
              
              
              
        },
        error: (err) =>{
              this.error = true;
              this.success = false;
               setTimeout(()=>{
                this.error = false;
              }, 3000);
        }
      }
    )


  }
  _fillFromData(trail: Trail)
  {
    this.editTrailForm.setValue(
            { name: trail.name, 
              city: trail.city, 
              state: trail.state,
              length: trail.length,
              loop: trail.isALoop,
              sc: trail.startingCoordinates,
              ec: trail.endingCoordinates,
              url: trail.imageUrl
            
            });
    console.log(this.editTrailForm.value);
  }

}
