import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrailsDataService } from '../trails-data.service';
@Component({
  selector: 'app-trails',
  templateUrl: './trails.component.html',
  styleUrls: ['./trails.component.css']
})
export class TrailsComponent implements OnInit {
  trails!: Trail[];
  error: boolean = false;
  count: number = 5;
  offset: number = 0;
  isDisabled: boolean= true;
  isDisabledNext: boolean = false;
  constructor(private trailData: TrailsDataService) { }

  ngOnInit(): void {
      this.updateUI();
    } 

    prev()
    {
    
      if(this.offset - 5 >=0)
      {
        this.offset -=5;
        this.isDisabledNext = false;
        this.updateUI();
      }
      else
      {
        this.offset = 0;
        this.isDisabled = true;
        this.isDisabledNext= false;
        this.updateUI();
        
      }
    }
    next()
    {
      this.offset +=5;
      this.isDisabled = false;
      this.trails = [];
      this.updateUI();
    }
    updateUI()
    {
      this.trailData.getAll(this.count, this.offset).subscribe({
        next: (trails) => {
          if(trails.length > 0)
          {
            this.error = false;
            this.trails = trails;
            if(trails.length < 5)
            {
              this.isDisabledNext = true;
            }
          }
          else
          {
            this.offset -=5;
            this.isDisabledNext=true;
            this.error = true;
          }
        },
        error: (err)=>{
            this.error = true;
        }
      })
    } 
}


export class Trail{
  _id!: string;
  name!: string;
  state!: string;
  city!: string; 
  startingCoordinates!: string;
  endingCoordinates!: string;
  isALoop!: boolean;
  length!: string;
  imageUrl!: string;
  plants!: {
    name: string;
    id: string;
    type: string;
    plantWithFruit: string;
  }[];
  wildLife!: {
    name: string;
    isDangerous: boolean;
    type: string;
    _id: string;

  }[];
  fillFromForm(form: NgForm)
  {
    this.name=form.value.name; 
    this.state=form.value.state;
    this.city=form.value.city;
    this.startingCoordinates=form.value.sc;
    this.endingCoordinates=form.value.ec
    this.isALoop=form.value.loop;
    this.length=form.value.length;
    this.imageUrl=form.value.url;
    
  }
  json() :any
  {
    return {
  
      name:this.name,
      state:this.state, 
      city:this.city,
      startingCoordinates:this.startingCoordinates,
      endingCoordinates:this.endingCoordinates,
      isALoop:this.isALoop,
      length:this.length,
      imageUrl:this.imageUrl,
    }
  }
}
