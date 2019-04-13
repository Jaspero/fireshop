import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Product} from '../../../shared/interfaces/product.interface';
import {MetaResolver} from '../../../shared/resolvers/meta.resolver';

@Injectable()
export class ProductResolver implements Resolve<Observable<Product>> {
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private metaResolver: MetaResolver
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.afs
      .doc<Product>(
        `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}/${
          route.params.id
        }`
      )
      .get()
      .pipe(
        map(product => {
          if (!product.exists) {
            this.router.navigate(['/404']);
            return;
          }

          const prod = {
            id: product.id,
            ...product.data()
          } as Product;

          this.metaResolver.resolve({
            data: {
              meta: {
                title: prod.name,
                description: prod.shortDescription
              }
            }
          });

          return prod;
        }),

        catchError(error => {
          this.router.navigate(['/404']);
          return throwError(error);
        })
      );
  }
}
