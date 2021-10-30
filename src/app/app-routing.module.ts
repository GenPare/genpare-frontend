import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompareComponent } from './compare/compare.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { StartPageComponent } from './components/start-page/start-page.component';
import { ProfileManagementComponent } from "./profile-management/profile-management.component";


const routes: Routes = [
  { path: 'compare', component: CompareComponent },
  { path: 'profile', component: ProfileManagementComponent ,canActivate: [AuthGuard]},
  { path: 'start', component: StartPageComponent },
  { path: '', redirectTo: 'compare', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
