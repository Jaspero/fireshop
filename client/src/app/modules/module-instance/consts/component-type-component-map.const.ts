import {ComponentType} from '../../../shared/interfaces/component-type.enum';
import {DateFieldComponent} from '../components/fields/date-field/date-field.component';
import {CheckboxComponent} from '../components/fields/checkbox/checkbox.component';
import {DraggableListComponent} from '../components/fields/draggable-list/draggable-list.component';
import {GalleryComponent} from '../components/fields/gallery/gallery.component';
import {ImageComponent} from '../components/fields/image/image.component';
import {InputComponent} from '../components/fields/input/input.component';
import {SelectComponent} from '../components/fields/select/select.component';
import {SliderComponent} from '../components/fields/slider/slider.component';
import {ToggleComponent} from '../components/fields/toggle/toggle.component';
import {WysiwygComponent} from '../components/fields/wysiwyg/wysiwyg.component';

export const COMPONENT_TYPE_COMPONENT_MAP = {
  [ComponentType.Input]: InputComponent,
  [ComponentType.Toggle]: ToggleComponent,
  [ComponentType.Select]: SelectComponent,
  [ComponentType.Image]: ImageComponent,
  [ComponentType.Gallery]: GalleryComponent,
  [ComponentType.Checkbox]: CheckboxComponent,
  [ComponentType.Date]: DateFieldComponent,
  [ComponentType.Slider]: SliderComponent,
  [ComponentType.Wysiwyg]: WysiwygComponent,
  [ComponentType.Draggable]: DraggableListComponent
};
