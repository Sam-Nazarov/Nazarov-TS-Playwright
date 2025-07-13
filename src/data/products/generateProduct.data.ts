import { IProduct, IProductInOrder } from 'types';
import { generateID, getRandromEnumValue } from 'utils';
import { MANUFACTURERS } from './manufacturers.data';
import { faker } from '@faker-js/faker';

export function generateProductData(params?: Partial<IProduct>): IProduct {
  return {
    name: `Product ${Date.now()}${faker.string.alpha(1)}`,
    manufacturer: getRandromEnumValue(MANUFACTURERS),
    price: faker.number.int({ min: 1, max: 99999 }),
    amount: faker.number.int({ min: 0, max: 999 }),
    notes: `Notes ${faker.string.alpha(244)}`,
    ...params,
  };
}

export function generateProductDataForOrder(params?: Partial<IProduct>): IProductInOrder {
  return {
    received: false,
    _id: generateID(),
    ...generateProductData(params),
  };
}
