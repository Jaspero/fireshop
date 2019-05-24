import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface DragData extends FieldData {
  options: Array<string>;
}

@Component({
  selector: 'jms-draggable-list',
  templateUrl: './draggable-list.component.html',
  styleUrls: ['./draggable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableListComponent extends FieldComponent<DragData>
  implements OnInit {
  ngOnInit() {
    this.cData.options = this.cData.control.value;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.cData.options,
      event.previousIndex,
      event.currentIndex
    );
    this.cData.control.setValue(this.cData.options);
  }
}
