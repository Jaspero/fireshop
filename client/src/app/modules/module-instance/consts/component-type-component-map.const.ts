import {ComponentType} from '../../../shared/interfaces/component-type.enum';
import {AutocompleteComponent} from '../components/fields/autocomplete/autocomplete.component';
import {ChipsComponent} from '../components/fields/chips/chips.component';
import {DateFieldComponent} from '../components/fields/date-field/date-field.component';
import {CheckboxComponent} from '../components/fields/checkbox/checkbox.component';
import {DraggableListComponent} from '../components/fields/draggable-list/draggable-list.component';
import {FileComponent} from '../components/fields/file/file.component';
import {GalleryComponent} from '../components/fields/gallery/gallery.component';
import {ImageComponent} from '../components/fields/image/image.component';
import {InputComponent} from '../components/fields/input/input.component';
import {RadioComponent} from '../components/fields/radio/radio.component';
import {SelectComponent} from '../components/fields/select/select.component';
import {SliderComponent} from '../components/fields/slider/slider.component';
import {TextareaComponent} from '../components/fields/textarea/textarea.component';
import {ToggleComponent} from '../components/fields/toggle/toggle.component';
import {WysiwygComponent} from '../components/fields/wysiwyg/wysiwyg.component';

export const COMPONENT_TYPE_COMPONENT_MAP = {
  [ComponentType.Input]: InputComponent,
  [ComponentType.Toggle]: ToggleComponent,
  [ComponentType.Select]: SelectComponent,
  [ComponentType.File]: FileComponent,
  [ComponentType.Image]: ImageComponent,
  [ComponentType.Gallery]: GalleryComponent,
  [ComponentType.Checkbox]: CheckboxComponent,
  [ComponentType.Autocomplete]: AutocompleteComponent,
  [ComponentType.Date]: DateFieldComponent,
  [ComponentType.Slider]: SliderComponent,
  [ComponentType.Wysiwyg]: WysiwygComponent,
  [ComponentType.Draggable]: DraggableListComponent,
  [ComponentType.Radio]: RadioComponent,
  [ComponentType.Chips]: ChipsComponent,
  [ComponentType.Textarea]: TextareaComponent
};
