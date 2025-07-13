import { faker } from '@faker-js/faker';
import { IDelivery, IDeliveryOptions } from 'types';
import { getRandromEnumValue } from 'utils';
import { DELIVERY_CONDITIONS } from './delivery.data';
import { COUNTRIES } from '../customers';
import _ from 'lodash';

export function generateDeliveryData(params?: IDeliveryOptions): IDelivery {
  const defaults = {
    finalDate: faker.date.soon({ days: 60 }).toISOString(),
    condition: getRandromEnumValue(DELIVERY_CONDITIONS),
    address: {
      country: getRandromEnumValue(COUNTRIES),
      city: `City ${faker.string.alpha(15)}`,
      street: `Street ${faker.string.alphanumeric(33)}`,
      house: faker.number.int(999),
      flat: faker.number.int(9999),
    },
  };
  return _.merge(defaults, params);
}
