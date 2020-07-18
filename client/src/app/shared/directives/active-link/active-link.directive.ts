import {Location} from '@angular/common';
import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {NavigationItemWithActive} from '../../interfaces/navigation-item-with-active.interface';

/**
 * Handles navigation and makes the element active if the route matches.
 * It uses the navigator instead of the angular router.
 */
@Directive({
  selector: '[jmsActiveLink]'
})
export class ActiveLinkDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private location: Location,
    private router: Router
  ) {}

  @Input('jmsActiveLink')
  options: NavigationItemWithActive;

  lastState: string;
  matched: boolean;

  ngOnInit() {
    this.lastState = location.pathname;
    this.toggleActive();

    this.location.onUrlChange(url => {
      if (url !== this.lastState) {
        this.lastState = url;
        this.toggleActive();
      }
    });
  }

  @HostListener('click')
  click() {
    this.router.navigate([this.options.value])
  }

  toggleActive() {
    const el = this.el.nativeElement;
    const exact = this.options.routerOptions && this.options.routerOptions.exact;
    const match = exact ? this.lastState === this.options.value : this.lastState.startsWith(this.options.value);

    if (match) {
      this.renderer.addClass(el, 'active');
    } else if (this.matched) {
      this.renderer.removeClass(el, 'active');
    }

    this.matched = match;
  }
}
