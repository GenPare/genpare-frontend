import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompareComponent } from '@comp/compare/compare.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { StartPageComponent } from './components/start-page/start-page.component';
import { SupportPageComponent } from './components/support-page/support-page.component';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';
import { LoginSuccessComponent } from '@comp/login-success/login-success.component';
import { HasEnteredDataGuard } from './guards/has-entered-data';
import { IsLoggedIn } from './guards/is-logged-in';

const routes: Routes = [
  { path: 'compare', component: CompareComponent, canActivate: [IsLoggedIn,HasEnteredDataGuard] },
  { path: 'profile', component: ProfileManagementComponent ,canActivate: [IsLoggedIn]},
  { path: 'start', component: StartPageComponent },
  { path: 'support', component: SupportPageComponent},
  { path: 'success', component: LoginSuccessComponent,canActivate: [AuthGuard]},
  { path: '', redirectTo: 'start', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
