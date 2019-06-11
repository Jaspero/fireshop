import {Observable} from 'rxjs';

export function readFile(blob: Blob): Observable<string> {
  return new Observable(obs => {
    if (!(blob instanceof Blob)) {
      obs.error(new Error('`blob` must be an instance of File or Blob.'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = err => obs.error(err);
    reader.onabort = err => obs.error(err);
    reader.onload = () => obs.next(reader.result as string);
    reader.onloadend = () => obs.complete();

    return reader.readAsDataURL(blob);
  });
}
