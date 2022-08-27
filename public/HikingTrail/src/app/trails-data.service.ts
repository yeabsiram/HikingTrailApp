import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plant } from './add-plant/add-plant.component';
import { WildLife } from './add-wildlife/add-wildlife.component';
import { AtuthenticationService } from './atuthentication.service';
import { Trail } from './trails/trails.component';

@Injectable({
  providedIn: 'root'
})
export class TrailsDataService {

  constructor(private http: HttpClient, private authentication : AtuthenticationService) { }

  //baseUrl: string = "http://localhost:3000/api/trails/";
  baseUrl: string = environment.baseUrl;
  tokenString = "Bearer "+ this.authentication.token;

   getAll(count: number, offset: number): Observable<any[]> {
    const url = this.baseUrl + `?count=${count}&offset=${offset}`;
    return this.http.get<Trail[]>(url);
  }

  getOne(id: string): Observable<Trail>{
    const url = this.baseUrl + id;
    return this.http.get<Trail>(url);
  }
  deleteOne(id: string): Observable<string>{
    const url = this.baseUrl+ id;
    return this.http.delete<string>(url, {headers: {'authorization': this.tokenString}});
  }
  addOne(trail: Trail): Observable<Trail>{
    const url = this.baseUrl;
    
    return this.http.post<Trail>(url, trail.json(), {headers: {'authorization': this.tokenString}});
  }
  patchTrail(id: string, trail: Trail): Observable<Trail>{
    const url = this.baseUrl+ id;

    return this.http.patch<Trail>(url, trail.json(), {headers: {'authorization': this.tokenString}});
  }
  addPlant(id: string, plant: Plant): Observable<Plant>
  {
    const url = this.baseUrl + id + "/plants/";
    return this.http.post<Plant>(url, plant.json(), {headers: {'authorization': this.tokenString}});

  }

  addWildlife(id: string, wildLife: WildLife): Observable<WildLife>{
    const url = this.baseUrl + id + "/wildlife/";
    return this.http.post<WildLife>(url, wildLife.json(), {headers: {'authorization': this.tokenString}});
  }
  search(searchTerm: string): Observable<Trail[]>{
    const url = this.baseUrl +`search/search?searchValue=${searchTerm}`;
    return this.http.get<Trail[]>(url);
  }
}
