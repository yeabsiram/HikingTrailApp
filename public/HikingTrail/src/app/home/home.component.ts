import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrailsDataService } from '../trails-data.service';
import { Trail } from '../trails/trails.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('searchForm')
  searchForm!: NgForm;
  

  constructor(private trailData: TrailsDataService) { }
  trailSearch!: Trail[];
  featuredTrail!: Trail[];
  searchResSuccess: boolean= false;
  searchResError: boolean = false;
  count: number =3;
  offset: number = 0;
  ngOnInit(): void {

    this.trailData.getAll(this.count, this.offset).subscribe((trails)=>{
      if(trails)
      {
        this.featuredTrail = trails;
        console.log(this.featuredTrail);
      }
    })
  }
  search(): void{
    let searchQuery = this.searchForm.value.searchQuery;
    console.log(searchQuery);
    this.trailData.search(searchQuery).subscribe({
      next: (response)=>{
        if(response.length > 0)
        {
          this.searchResSuccess= true;
          this.trailSearch =response;
        }
        else{
          this.searchResSuccess = false;
          this.searchResError = true;
          setTimeout(()=>{
            this.searchResError = false;
          }, 3000);

        }
       
      },
      error: (error)=>{
        console.log(error);
      }
    })
  }
}
