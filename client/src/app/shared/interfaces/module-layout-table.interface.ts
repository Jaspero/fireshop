import {PipeType} from '../enums/pipe-type.enum';

export interface ModuleLayoutTableColumn {
  /**
   * This flags indicates that the column
   * should be turned in to a form control
   * if it's applied the key property needs
   * to be a string
   */
  control?: boolean;

  key: string | string[];
  label?: string;
  pipe?: PipeType | PipeType[];
  pipeArguments?: any | {[key: string]: any};
  sortable?: boolean;
  join?: string;
  tooltip?: string | ((data: any) => any);
  tooltipFunction?: boolean;
  nestedColumns?: ModuleLayoutTableNestedColumn[];
  authorization?: string[];
}

export interface ModuleLayoutTableNestedColumn extends ModuleLayoutTableColumn {
  showLabel?: boolean;
}

export interface ModuleLayoutTableAction {
  /**
   * item => web element
   */
  value: string;
  authorization?: string[];
}

export interface ModuleLayoutTable {
  tableColumns?: ModuleLayoutTableColumn[];
  hideCheckbox?: string[];
  hideEdit?: string[];
  hideDelete?: string[];
  hideExport?: string[];
  hideImport?: string[];
  actions?: ModuleLayoutTableAction[];

  /**
   * True by default
   */
  stickyHeader?: boolean;
}
