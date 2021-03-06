import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {DbService} from '../../shared/services/db/db.service';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-e-tpr',
  templateUrl: './trigger-password-reset.component.html',
  styleUrls: ['./trigger-password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriggerPasswordResetComponent {
  constructor(
    private el: ElementRef,
    private dbService: DbService
  ) { }

  trigger() {
    return () => {
      const {
        email
      } = this.el.nativeElement.dataset;

      return this.dbService.callFunction(
        'cms-triggerPasswordReset',
        {email, url: `${location.origin}/reset-password`}
      )
        .pipe(
          notify({
            success: 'Reset password request sent successfully',
            error: 'There was an error sending the request'
          })
        )
    }
  }
}
