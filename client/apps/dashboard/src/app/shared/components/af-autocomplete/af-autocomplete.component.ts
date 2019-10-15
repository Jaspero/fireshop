import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfs-af-autocomplete',
  templateUrl: './af-autocomplete.component.html',
  styleUrls: ['./af-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AfAutocompleteComponent implements OnInit {
  constructor() {}

  @Input()
  placeholder: string;

  @Input()
  query: (search: string) => AngularFirestoreCollection;

  search = new FormControl('');
  results$: Observable<any[]>;

  ngOnInit() {
    this.results$ = this.search.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.query(value).get()),
      map(res =>
        res.docs.map(it => ({
          id: it.id,
          ...it.data()
        }))
      )
    );
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {}
}
