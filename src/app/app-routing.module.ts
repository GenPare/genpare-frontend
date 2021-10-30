import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompareComponent } from '@comp/compare/compare.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { StartPageComponent } from '@comp/start-page/start-page.component';
import { ProfileManagementComponent } from "@comp/profile-management/profile-management.component";

const routes: Routes = [
  { path: 'compare', component: CompareComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileManagementComponent, canActivate: [AuthGuard]},
  { path: 'start', component: StartPageComponent },
  { path: '', redirectTo: 'compare', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
