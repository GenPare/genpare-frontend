import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ProfileManagementComponent } from 'app/components/profile-management/profile-management.component';
import { ToastService } from 'app/services/toast.service';

@Injectable()
export class HasEnteredDataGuard
  implements CanDeactivate<ProfileManagementComponent>
{
  constructor(private toastService: ToastService) {}
  canDeactivate(): boolean {
    //TODO if Account has saved Data
    this.toastService.show(
      'Sie können GenPare erst nutzen, wenn Sie Ihre Daten eingeben.',
      { classname: 'bg-danger text-light', delay: 15000 }
    );
    return true;
  }
}
