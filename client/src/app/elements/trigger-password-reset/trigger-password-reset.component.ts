import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {functions} from 'firebase';
import {from} from 'rxjs';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-e-tpr',
  templateUrl: './trigger-password-reset.component.html',
  styleUrls: ['./trigger-password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriggerPasswordResetComponent {
  constructor(
    private el: ElementRef
  ) { }

  trigger() {
    return () => {
      const {
        email
      } = this.el.nativeElement.dataset;
      const func = functions().httpsCallable('cms-triggerPasswordReset');

      return from(func(email))
        .pipe(
          notify({
            success: 'Reset password request sent successfully',
            error: 'There was an error sending the request'
          })
        )
    }
  }
}
