import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ReactiveFormsModule } from '@angular/forms';





import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { TrailsComponent } from './trails/trails.component';
import { TrailComponent } from './trail/trail.component';
import { AddTrailComponent } from './add-trail/add-trail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditTrailComponent } from './edit-trail/edit-trail.component';
import { AddPlantComponent } from './add-plant/add-plant.component';
import { AddWildlifeComponent } from './add-wildlife/add-wildlife.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    TrailsComponent,
    TrailComponent,
    AddTrailComponent,
    LoginComponent,
    RegisterComponent,
    EditTrailComponent,
    AddPlantComponent,
    AddWildlifeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([{
      path: "trails",
      component: TrailsComponent
    },
    {
      path: "",
      component: HomeComponent
    },
    {
      path: "editTrail/:trailId",
      component: EditTrailComponent
    },
    {
      path: "addPlant/:trailId",
      component: AddPlantComponent
    },
    {
      path: "addWildLife/:trailId",
      component: AddWildlifeComponent
    },
    {
      path: "trails/:trailId",
      component: TrailComponent
    },

    {
      path: "addTrail",
      component: AddTrailComponent
    },
    {
      path: "login",
      component: LoginComponent
    },
    {
      path: "register",
      component: RegisterComponent
    }
    ])
  ],
  providers: [{provide: JWT_OPTIONS, useValue: JWT_OPTIONS}, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
