import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StateService} from '../../shared/services/state/state.service';

@Component({
  selector: 'jms-new-prepopulate',
  templateUrl: './new-prepopulate.component.html',
  styleUrls: ['./new-prepopulate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPrepopulateComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private state: StateService,
    private router: Router
  ) { }

  @Input()
  label = 'Prepopulate';

  @Input()
  docId: string;

  @Input()
  subCollection: string;

  @Input()
  collection: string;
  data: any;

  ngOnInit(): void {
    this.data = Object.assign({}, this.el.nativeElement.dataset);
  }

  prepopulate() {
    this.state.prepopulateData.next(this.data);

    if (this.docId && this.subCollection) {
      this.router.navigate([`/m/${this.collection}/${this.docId}/${this.subCollection}/single/new`]);
    } else {
      this.router.navigate([`/m/${this.collection}/single/new`])
    }
  }
}
