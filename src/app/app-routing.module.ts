import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { StartPageComponent } from './components/start-page/start-page.component';
import { HasEnteredDataGuard } from './guards/has-entered-data';
import { ProfileManagementComponent } from './profile-management/profile-management.component';


const routes: Routes = [
  { path: 'profile', component: ProfileManagementComponent ,canActivate: [AuthGuard],canDeactivate:[HasEnteredDataGuard]},
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: StartPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
