import { APIRequestContext } from '@playwright/test';
import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config/apiConfig';
import { ORDER_STATUSES } from 'data/orders/statuses.data';
import { IRequestOptions } from 'types/api.types';
import {
  IDelivery,
  IOrderCommentRequest,
  IOrderRequest,
  IOrderResponse,
  IOrderResponseSorted,
  IOrderSortRequest,
} from 'types/orders.types';
import { logStep } from 'utils/reporter.utils';
import { convertRequestParams } from 'utils/requestParams.utils';

export class OrdersController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('Send create new order request')
  async create(body: IOrderRequest, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS,
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('Send getAllSorted orders request with optional filters and sorting')
  async getAllSorted(token: string, params?: IOrderSortRequest) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url:
        apiConfig.ENDPOINTS.ORDERS +
        (params ? convertRequestParams(params as Record<string, string | Array<string>>) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponseSorted>(options);
  }

  @logStep('Send get order by id request')
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS_BY_ID(id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('Send update order request')
  async update(id: string, body: IOrderRequest, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS_BY_ID(id),
      method: 'put',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('Send delete order request')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }

  @logStep('Send assign manager request')
  async assignManager(orderId: string, managerId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ASSIGN_MANAGER(orderId, managerId),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('Send unassign manager request')
  async unassignManager(orderId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.UNASSIGN_MANAGER(orderId),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('Send add comment request to order ')
  async addComment(orderId: string, body: IOrderCommentRequest, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_COMMENTS_ADD(orderId),
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('Send delete comment request to order ')
  async deleteComment(orderId: string, commentId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_COMMENTS_DELETE(orderId, commentId),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }

  @logStep('Send update delivery details request')
  async updateDelivery(orderId: string, body: IDelivery, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_DELIVERY(orderId),
      method: 'post',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('Send receive products request')
  async receiveProduct(orderId: string, prodID: string[], token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_RECEIVE(orderId),
      method: 'post',
      data: { products: prodID },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('Send update status request')
  async updateStatus(orderId: string, status: ORDER_STATUSES, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_STATUS(orderId),
      method: 'put',
      data: { status },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }
}
