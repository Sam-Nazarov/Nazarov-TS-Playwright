import { IOrderCommentRequest } from 'types/orders.types';
import { faker } from '@faker-js/faker';

export function generateCommentData(param?: IOrderCommentRequest): IOrderCommentRequest {
  return {
    comment: `Comment${faker.string.alpha(243)}`,
    ...param,
  };
}
