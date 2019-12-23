import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';
import {StateService} from '../../services/state/state.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fDisable]'
})
export class ForceDisableDirective implements OnInit {
  constructor(
    private state: StateService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    // TODO: refactor to work with dynamic roles
    // if (this.state.role === Role.Read) {
    //   this.renderer.addClass(this.el.nativeElement, 'disabled');
    // }
  }
}
