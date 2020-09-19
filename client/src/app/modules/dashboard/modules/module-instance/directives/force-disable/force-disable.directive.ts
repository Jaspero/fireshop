import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {ModuleAuthorization} from '../../../../../../shared/interfaces/module-authorization.interface';
import {StateService} from '../../../../../../shared/services/state/state.service';

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

  @Input()
  fDisable: ModuleAuthorization;

  ngOnInit() {
    if (this.fDisable && this.fDisable.write && !this.fDisable.write.includes(this.state.role)) {
      this.renderer.addClass(this.el.nativeElement, 'disabled');
    }
  }
}
