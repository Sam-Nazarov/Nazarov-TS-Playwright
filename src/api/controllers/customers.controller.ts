import { APIRequestContext } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config';
import { IOrdersResponse } from 'types';
import { IRequestOptions } from 'types/api.types';
import { ICustomer, ICustomerResponse, ICustomersResponse, ICustomersResponseSorted } from 'types/customer.types';
import { logStep } from 'utils';
import { convertRequestParams } from 'utils/requestParams.utils';

export class CustomersController {
  private request: RequestApi;
  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('Send create customer request')
  async create(body: ICustomer, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMERS,
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep('Send get customer by id request')
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep('Send getAll customers request')
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMERS_ALL,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomersResponse>(options);
  }

  @logStep('Send getAllSorted customers request')
  async getAllSorted(token: string, params?: Record<string, string>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMERS + (params ? convertRequestParams(params) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomersResponseSorted>(options);
  }

  @logStep('Send update customer request')
  async update(id: string, body: ICustomer, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'put',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep('Send delete customers request')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }

  @logStep('Send get customer orders requets')
  async getOrders(customerId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_ORDERS(customerId),
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrdersResponse>(options);
  }
}
