import { APIRequestContext } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';
import { IProduct, IProductResponseSorted, IProductsResponse, IRequestOptions } from 'types';
import { apiConfig } from 'config';
import { IProductResponse } from 'types';
import { convertRequestParams, logStep } from 'utils';

export class ProductsController {
  private request: RequestApi;
  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('Send get product by id request')
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep('Send delete product request')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }

  @logStep('Send create product request')
  async create(body: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS,
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep('Send update product request')
  async update(id: string, body: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      data: body,
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep('Send getAll products request')
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS_ALL,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductsResponse>(options);
  }

  @logStep('Send getAllSorted products request')
  async getAllSorted(token: string, params?: Record<string, string>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS + (params ? convertRequestParams(params) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponseSorted>(options);
  }
}
