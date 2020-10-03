import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ModuleLayoutTableColumn} from '../../../../../../shared/interfaces/module-layout-table.interface';

interface AdjustableColumn {
  data: ModuleLayoutTableColumn;
  active: FormControl;
  label: FormControl;
}

@Component({
  selector: 'jms-column-organization',
  templateUrl: './column-organization.component.html',
  styleUrls: ['./column-organization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnOrganizationComponent implements OnInit {

  @Input()
  tableColumns: ModuleLayoutTableColumn[];

  columns: AdjustableColumn[];

  ngOnInit() {
    this.columns = this.tableColumns.map(data => ({
      data,
      active: new FormControl(!data.disabled),
      label: new FormControl(data.label)
    }))
  }

  drop(event: CdkDragDrop<AdjustableColumn[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  save(): ModuleLayoutTableColumn[] {
    return this.columns.map(it => ({
      ...it.data,
      label: it.label.value,
      disabled: !it.active.value
    }))
  }
}
