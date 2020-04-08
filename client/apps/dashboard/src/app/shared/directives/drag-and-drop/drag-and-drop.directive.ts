import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Directive({
  selector: '[jfscDropZone]'
})
export class DragAndDropDirective {
  @Output()
  fileDrop = new EventEmitter<any>();

  @Input()
  preventBodyDrop = true;

  @HostBinding('class.drop-zone-active')
  active = false;

  @HostBinding('style.background-color') private background = '#f5fcff';
  @HostBinding('style.opacity') private opacity = '1';

  constructor() {}

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.active = false;

    const {dataTransfer} = event;

    if (dataTransfer.items) {
      const files = [];

      for (let i = 0; i < dataTransfer.items.length; i++) {
        if (dataTransfer.items[i].kind === 'file') {
          files.push(dataTransfer.items[i].getAsFile());
        }
      }

      dataTransfer.items.clear();
      this.fileDrop.emit({files});
    } else {
      const files = dataTransfer.files;
      dataTransfer.clearData();
      this.fileDrop.emit({files: Array.from(files)});
    }

    this.background = '#f5fcff';
    this.opacity = '1';
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.active = true;
    this.background = '#9ecbec';
    this.opacity = '0.8';
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.active = false;

    this.background = '#f5fcff';
    this.opacity = '1';
  }

  @HostListener('body:dragover', ['$event'])
  onBodyDragOver(event: DragEvent) {
    if (this.preventBodyDrop) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('body:drop', ['$event'])
  onBodyDrop(event: DragEvent) {
    if (this.preventBodyDrop) {
      event.preventDefault();
    }
  }
}
