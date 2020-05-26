declare module 'currency-codes/data' {
  const data: Array<{
    code: string;
    number: string;
    digits: number;
    currency: string;
    countries: string[];
  }>;

  export = data;
}
