import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'jms-module-definition',
  templateUrl: './module-definition.component.html',
  styleUrls: ['./module-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleDefinitionComponent {}
