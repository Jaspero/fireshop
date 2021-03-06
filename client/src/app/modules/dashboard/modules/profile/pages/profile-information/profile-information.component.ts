import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilderComponent, FormBuilderData, SegmentType} from '@jaspero/form-builder';
import {switchMap} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../../../../../integrations/firebase/firestore-collection.enum';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {notify} from '../../../../../../shared/utils/notify.operator';

@Component({
  selector: 'jms-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileInformationComponent {
  constructor(
    private state: StateService,
    private db: DbService
  ) {
  }

  formData: FormBuilderData = {
    value: this.state.user,
    schema: {
      properties: {
        name: {
          type: 'string'
        },
        profileImage: {
          type: 'string'
        }
      }
    },
    definitions: {
      name: {
        label: 'PROFILE.NAME'
      },
      profileImage: {
        label: 'PROFILE.IMAGE',
        class: 'profile',
        component: {
          type: 'image',
          configuration: {
            maxSize: 10485760
          }
        }
      }
    },
    segments: [
      {
        type: SegmentType.Empty,
        fields: [
          '/name',
          '/profileImage'
        ]
      }
    ]
  };

  save(form: FormBuilderComponent) {
    return () =>
      form.save(FirestoreCollection.Users, this.state.user.id)
        .pipe(
          switchMap(() =>
            this.db.setDocument(
              FirestoreCollection.Users,
              this.state.user.id,
              form.form.getRawValue(),
              {
                merge: true
              }
            ),
          ),
          notify({
            success: `Information updated successfully`
          })
        );
  }
}
