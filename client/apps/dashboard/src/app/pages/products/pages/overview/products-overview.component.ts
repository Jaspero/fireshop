import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Customer} from '@jf/interfaces/customer.interface';
import {Order} from '@jf/interfaces/order.interface';
import {Review} from '@jf/interfaces/review.interface';
import {extent, max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {scaleLinear, scaleOrdinal} from 'd3-scale';
import {line} from 'd3-shape';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {select} from 'd3-selection';

@Component({
  selector: 'jfsc-products-overview',
  templateUrl: './products-overview.component.html',
  styleUrls: ['./products-overview.component.css']
})
export class ProductsOverviewComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  data$: Observable<{
    orders: Order[];
    reviews: Review[];
    customers: Customer[];
  }>;

  @ViewChild('graph')
  graph: ElementRef<SVGAElement>;

  data1 = [{ser1: 0.3, ser2: 4}, {ser1: 2, ser2: 16}, {ser1: 3, ser2: 8}];
  data2 = [{ser1: 1, ser2: 7}, {ser1: 4, ser2: 1}, {ser1: 6, ser2: 8}];

  margin = {top: 10, right: 30, bottom: 30, left: 50};
  width = 460 - this.margin.left - this.margin.right;
  height = 400 - this.margin.top - this.margin.bottom;

  svg = select(this.graph.nativeElement)
    .append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .append('g')
    .attr(
      'transform',
      'translate(' + this.margin.left + ',' + this.margin.top + ')'
    );

  x = scaleLinear().range([0, this.width]);
  xAxis = axisBottom().scale(this.x);

  // Initialize an Y axis
  y = scaleLinear().range([this.height, 0]);
  yAxis = axisLeft().scale(this.y);

  baseSetup() {
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .attr('class', 'myXaxis');

    this.svg.append('g').attr('class', 'myYaxis');
  }

  update(data) {
    // Create the X axis:
    this.x.domain([0, max(data, d => d.ser1)]);
    this.svg
      .selectAll('.myXaxis')
      .transition()
      .duration(3000)
      .call(xAxis);

    // create the Y axis
    y.domain([
      0,
      max(data, function(d) {
        return d.ser2;
      })
    ]);
    this.svg
      .selectAll('.myYaxis')
      .transition()
      .duration(3000)
      .call(yAxis);

    let u = this.svg.selectAll('.lineTest').data([data], function(d) {
      return d.ser1;
    });

    u.enter()
      .append('path')
      .attr('class', 'lineTest')
      .merge(u)
      .transition()
      .duration(3000)
      .attr(
        'd',
        line()
          .x(function(d) {
            return x(d.ser1);
          })
          .y(function(d) {
            return y(d.ser2);
          })
      )
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2.5);
  }

  ngOnInit() {
    this.baseSetup();
    // this.data$ = this.activatedRoute.params.pipe(
    //   switchMap(identifier =>
    //     forkJoin([
    //       this.afs
    //         .collection(FirestoreCollections.Orders, ref =>
    //           ref.where(
    //             'orderItems',
    //             FirebaseOperator.ArrayContains,
    //             identifier.id
    //           )
    //         )
    //         .get()
    //         .pipe(
    //           map(actions =>
    //             actions.docs.map(action => ({
    //               id: action.id,
    //               ...(action.data() as Order)
    //             }))
    //           )
    //         ),
    //
    //       this.afs
    //         .collection(FirestoreCollections.Reviews, ref =>
    //           ref.where('productId', FirebaseOperator.Equal, identifier.id)
    //         )
    //         .get()
    //         .pipe(
    //           map(actions =>
    //             actions.docs.map(action => ({
    //               id: action.id,
    //               ...(action.data() as Review)
    //             }))
    //           )
    //         ),
    //
    //       this.afs
    //         .collection(FirestoreCollections.Customers, ref =>
    //           ref.where(
    //             'wishList',
    //             FirebaseOperator.ArrayContains,
    //             identifier.id
    //           )
    //         )
    //         .get()
    //         .pipe(
    //           map(actions =>
    //             actions.docs.map(action => ({
    //               id: action.id,
    //               ...(action.data() as Customer)
    //             }))
    //           )
    //         )
    //     ])
    //   ),
    //   map(data => ({
    //     orders: data[0],
    //     reviews: data[1],
    //     customers: data[2]
    //   }))
    // );
  }
}
