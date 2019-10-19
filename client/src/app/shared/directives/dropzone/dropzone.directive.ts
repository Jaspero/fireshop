import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[jmsDropzone]'
})
export class DropzoneDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @Input() hoverClass = 'active';
  @Output() dropped = new EventEmitter<FileList>();
  @Output() hovered = new EventEmitter<boolean>();

  @HostListener('drop', ['$event'])
  onDrop($event) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.renderer.removeClass(this.el.nativeElement, this.hoverClass);
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    $event.preventDefault();
    this.renderer.addClass(this.el.nativeElement, this.hoverClass);
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    $event.preventDefault();
    this.renderer.removeClass(this.el.nativeElement, this.hoverClass);
    this.hovered.emit(false);
  }
}
