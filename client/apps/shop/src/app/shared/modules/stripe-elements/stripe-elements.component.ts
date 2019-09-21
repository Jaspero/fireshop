import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, Subject} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {BaseElement} from './classes/base-element.class';
import {ELEMENTS_MAP} from './consts/elements-map.const';
import {ElementConfig} from './interfaces/element-config.interface';

@Component({
  selector: 'jfs-stripe-elements',
  templateUrl: './stripe-elements.component.html',
  styleUrls: ['./stripe-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StripeElementsComponent implements OnInit {
  constructor(
    @Inject('publicKey') private publicKey: string,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('hostEl', {static: true})
  hostEl: ElementRef<HTMLDivElement>;

  elements: stripe.elements.Elements;
  stripe: stripe.Stripe;

  @Input()
  clientSecret$: Observable<{clientSecret: string}>;

  /**
   * Which elements to show. Unsupported elements are filtered out.
   * If there are more then one supported element, the order is respected.
   */
  @Input()
  elementConfig: ElementConfig[];

  /**
   * List of elements that can be toggled through
   */
  availableElements: BaseElement[] = [];
  activeElementIndex: number;
  activeElement: BaseElement;

  @Output()
  paymentTriggered = new EventEmitter();

  error$ = new BehaviorSubject<string>('');

  ngOnInit() {
    this.stripe = Stripe(this.publicKey);
    this.elements = this.stripe.elements();

    forkJoin(
      this.elementConfig.map(el => {
        const instance = new ELEMENTS_MAP[el.type](
          this.stripe,
          this.clientSecret$,
          this.paymentTriggered,
          el.options,
          el.paymentOptions
        );

        return instance.canCreate().pipe(
          map(canCreate => ({
            canCreate,
            instance
          }))
        );
      })
    )
      .pipe(take(1))
      .subscribe(
        elements => {
          this.availableElements = elements.reduce((acc, cur) => {
            if (cur.canCreate) {
              acc.push(cur.instance);
            }

            return acc;
          }, []);

          this.activeElementIndex = 1;
          this.toggleUsedElement();
          this.cdr.markForCheck();
        },
        error => {
          console.log('error', error);
          this.error$.next('Error rendering payment methods.');
        }
      );
  }

  toggleUsedElement() {
    if (this.activeElementIndex === 0) {
      this.activeElementIndex = this.availableElements.length - 1;
    } else {
      this.activeElementIndex -= 1;
    }

    if (this.activeElement) {
      this.activeElement.element.destroy();
    }

    const activeElement = this.availableElements[this.activeElementIndex];

    activeElement
      .onMount()
      .pipe(take(1))
      .subscribe(() => {
        activeElement.element = this.elements.create(
          activeElement.type,
          activeElement.options
        );

        activeElement.element.mount(this.hostEl.nativeElement);

        activeElement.afterMount();

        this.activeElement = this.availableElements[this.activeElementIndex];
      });
  }
}
