import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Product} from '@jf/interfaces/product.interface';
import {fromStripeFormat} from '@jf/utils/stripe-format';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {MetaResolver} from '../../../shared/resolvers/meta.resolver';
import {StructuredDataResolver} from '../../../shared/resolvers/structured-data.resolver';
import {StateService} from '../../../shared/services/state/state.service';

@Injectable()
export class ProductResolver implements Resolve<Observable<Product>> {
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private metaResolver: MetaResolver,
    private state: StateService,
    private structuredDataResolver: StructuredDataResolver
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    this.state.loading$.next(true);

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

          this.structuredDataResolver.resolve({
            data: {
              structuredData: {
                '@type': 'Product',
                name: prod.name,
                description: prod.shortDescription,
                id: prod.id,
                category: prod.category,
                gallery: prod.gallery,
                offers: {
                  price: fromStripeFormat(prod.price),
                  active: prod.active
                }
              }
            }
          });

          return prod;
        }),

        finalize(() => this.state.loading$.next(false)),

        catchError(error => {
          this.router.navigate(['/404']);
          return throwError(error);
        })
      );
  }
}
