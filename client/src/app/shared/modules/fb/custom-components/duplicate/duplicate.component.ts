import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CUSTOM_COMPONENT_DATA, CustomComponent, CustomComponentData} from '@jaspero/form-builder';

@Component({
  selector: 'jms-duplicate',
  templateUrl: './duplicate.component.html',
  styleUrls: ['./duplicate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DuplicateComponent extends CustomComponent {
  constructor(
    @Inject(CUSTOM_COMPONENT_DATA)
    public data: CustomComponentData,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(data);
  }

  duplicate() {
    this.router.navigate([
      '..',
      `${this.data.id}--copy`
    ], {
      relativeTo: this.activatedRoute
    });
  }
}
