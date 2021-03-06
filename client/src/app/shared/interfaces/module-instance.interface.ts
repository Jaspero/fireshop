import {Segment} from '@jaspero/form-builder';

export interface ModuleInstance {

  /**
   * Receives the final results of the form
   * and should return what ever should be saved
   * on the document
   * (data: any) => any;
   */
  formatOnSave?: string;
  formatOnCreate?: string;
  formatOnEdit?: string;

  /**
   * (form: FormGroup) => void;
   */
  formatOnLoad?: string;
  segments: Segment[];
}
