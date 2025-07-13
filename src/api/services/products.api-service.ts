import { APIRequestContext } from '@playwright/test';
import { ProductsController } from 'api/controllers';
import { STATUS_CODES } from 'data';
import { generateProductData } from 'data/products';
import { productSchema } from 'data/schemas';
import { IProduct } from 'types';
import { logStep } from 'utils';
import { validateDeleteResponse, validateResponse, validateSchema } from 'utils/validations';

export class ProductsApiService {
  private controller: ProductsController;
  constructor(request: APIRequestContext) {
    this.controller = new ProductsController(request);
  }

  @logStep('Create product and get created product via API')
  async create(token: string, productData?: Partial<IProduct>) {
    const body = generateProductData(productData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    validateSchema(productSchema, response.body);
    return response.body.Product;
  }

  @logStep('Delete product via API')
  async delete(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    validateDeleteResponse(response);
  }

  @logStep('Create products in bulk and get created products via API')
  async createBulk(amount: number, token: string, productData?: Partial<IProduct>) {
    return await Promise.all(Array.from({ length: amount }, () => this.create(token, productData)));
  }
}
