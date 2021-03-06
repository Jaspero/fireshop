import {ModuleOverviewView} from './module-overview-view.interface';

export interface ModuleOverview {
  showViewSelector?: boolean;
  defaultView?: string;
  views?: ModuleOverviewView[];
  toolbar?: Array<string | {item: string, roles?: string[]}>;
}
