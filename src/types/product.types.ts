import { MANUFACTURERS } from 'data/products';
import { IPagination, IResponseFields, ISorting, ProductSortFields } from 'types/api.types';

export interface IProduct {
  name: string;
  manufacturer: MANUFACTURERS;
  price: number;
  amount: number;
  notes?: string;
}

export interface IProductFromResponse extends IProduct {
  _id: string;
  createdOn: string;
}

export interface IProductInOrder extends IProduct {
  _id: string;
  received: boolean;
}

export interface IProductResponse extends IResponseFields {
  Product: IProductFromResponse;
}

export interface IProductsResponse extends IResponseFields {
  Products: IProductFromResponse[];
}

export interface IProductResponseSorted extends IProductsResponse, IPagination {
  sorting: ISorting<ProductSortFields>;
  manufacturer: MANUFACTURERS[];
}

export interface ITopProduct {
  name: string;
  sales: number;
}
