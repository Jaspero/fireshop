import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  Optional
} from '@angular/core';
import {RESPONSE} from '@nguniversal/express-engine/tokens';
import {BROWSER_CONFIG} from '../../shared/consts/browser-config.const';

@Component({
  selector: 'jfs-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent implements OnInit {
  constructor(
    @Optional()
    @Inject(RESPONSE)
    private response: any
  ) {}

  ngOnInit() {
    /**
     * Make sure the API responds with 404
     * if this is the server rendering
     */
    if (!BROWSER_CONFIG.isBrowser) {
      this.response.status(404);
    }
  }
}
