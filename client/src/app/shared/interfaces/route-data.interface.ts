import OrderByDirection = firebase.firestore.OrderByDirection;

export interface RouteData {
  sort: {
    active: string;
    direction: OrderByDirection;
  };
  pageSize: number;
  filters?: any;
}
