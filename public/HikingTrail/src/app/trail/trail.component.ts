import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrailsDataService } from '../trails-data.service';
import { Trail } from '../trails/trails.component';
import { Location } from '@angular/common';
import { AtuthenticationService } from '../atuthentication.service';

@Component({
  selector: 'app-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.css']
})
export class TrailComponent implements OnInit {

  constructor(private location: Location, private route: ActivatedRoute, private trailData: TrailsDataService, private authenticate: AtuthenticationService, private router: Router) { }
  trail!: Trail;
  
  get isLoggedIn()
  {
    return this.authenticate.isLoggedIn;
  }

  ngOnInit(): void {

    const trailId = this.route.snapshot.params["trailId"];

    this.trailData.getOne(trailId).subscribe((trail) =>
    {
      this.trail = trail;
    })
    
  }
  back()
  {
    this.router.navigate(["trails"]);
  }
  deleteTrail(id: string):void{
    this.trailData.deleteOne(id).subscribe({
      next: () => {
        alert("Trail Deleted Successfully");
        this.location.back();
      },
      error: () =>{
        alert("Failled to delete trail");
        this.location.back();
      }
    })
  }

}
