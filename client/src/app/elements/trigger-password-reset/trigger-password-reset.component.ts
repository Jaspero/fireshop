import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
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
    private el: ElementRef,
    private aff: AngularFireFunctions,
  ) { }

  trigger() {
    return () => {
      const {
        email
      } = this.el.nativeElement.dataset;
      const func = this.aff.functions.httpsCallable('cms-triggerPasswordReset');

      return from(func(email))
        .pipe(
          notify()
        )
    }
  }
}
