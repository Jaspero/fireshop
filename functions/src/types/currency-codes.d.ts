declare module 'currency-codes' {

  function code(currency: string): {
    code: string;
    number: string;
    digits: number;
    currency: string;
    countries: string[];
  };

  function number(num: number): {
    code: string;
    number: string;
    digits: number;
    currency: string;
    countries: string[];
  };

  function country(currency: string): Array<{
    code: string;
    number: string;
    digits: number;
    currency: string;
    countries: string[];
  }>;
}

declare module 'currency-codes/data' {
  export default function data(): Array<{
    code: string;
    number: string;
    digits: number;
    currency: string;
    countries: string[];
  }>;
}