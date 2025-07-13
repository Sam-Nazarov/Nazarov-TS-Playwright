import { IProductFromResponse, ICustomerFromResponse, IProductInOrder } from 'types';
import { convertToDateAndTime } from 'utils';

export function convertAPIProductStatusTOUI(data: IProductInOrder) {
  if (data.received) return 'Received';
  else return 'Not Received';
}

export function convertProductToUIData(data: IProductFromResponse | IProductInOrder): Record<string, string> {
  return {
    Name: data.name,
    Manufacturer: data.manufacturer,
    Price: '$' + data.price.toString(),
    Notes: data.notes || '-',
  };
}

export function convertCustomerToUIData(data: ICustomerFromResponse): Record<string, string> {
  return {
    Email: data.email,
    Name: data.name,
    Country: data.country,
    City: data.city,
    Street: data.street,
    House: data.house.toString(),
    Flat: data.flat.toString(),
    Phone: data.phone,
    'Created On': convertToDateAndTime(data.createdOn),
    Notes: data.notes || '-',
  };
}
