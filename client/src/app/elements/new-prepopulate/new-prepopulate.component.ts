import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'jms-new-prepopulate',
  templateUrl: './new-prepopulate.component.html',
  styleUrls: ['./new-prepopulate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPrepopulateComponent implements OnInit {

  constructor(
    private el: ElementRef,
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
    const url = (this.docId && this.subCollection)
      ? `/m/${this.collection}/${this.docId}/${this.subCollection}/single/new`
      : `/m/${this.collection}/single/new`;

    return this.router.navigate([url], {
      state: {
        data: this.data
      }
    });
  }
}
