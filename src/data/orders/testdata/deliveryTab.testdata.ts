import { generateProductData } from 'data/products';
import { IOrderFromResponse } from 'types';
import { generateID } from 'utils';
import { generateDeliveryData } from '../generateDelivery.data';
import { ORDER_STATUSES } from '../statuses.data';

interface DeliveryTestData {
  statusName: string;
  idTag: string;
  isBtn: boolean;
  btnName: string;
  mockOrder: Pick<IOrderFromResponse, 'status' | 'delivery' | '_id'> & { products?: IOrderFromResponse['products'] };
}

export const deliveryTabTestdata: DeliveryTestData[] = [
  {
    statusName: 'Draft w/o delivery',
    idTag: '@1_O_DLVR_INTGR',
    isBtn: true,
    btnName: 'Schedule Delivery',
    mockOrder: {
      status: ORDER_STATUSES.DRAFT,
      delivery: null,
      _id: generateID(),
    },
  },
  {
    statusName: 'Draft with delivery',
    idTag: '@2_O_DLVR_INTGR',
    isBtn: true,
    btnName: 'Edit Delivery',
    mockOrder: {
      status: ORDER_STATUSES.DRAFT,
      delivery: generateDeliveryData(),
      _id: generateID(),
    },
  },
  {
    statusName: 'In Process',
    idTag: '@3_O_DLVR_INTGR',
    isBtn: false,
    btnName: '',
    mockOrder: {
      status: ORDER_STATUSES.IN_PROCESS,
      delivery: generateDeliveryData(),
      _id: generateID(),
    },
  },
  {
    statusName: 'Canceled with delivery',
    idTag: '@4_O_DLVR_INTGR',
    isBtn: false,
    btnName: '',
    mockOrder: {
      status: ORDER_STATUSES.CANCELED,
      delivery: generateDeliveryData(),
      _id: generateID(),
    },
  },
  {
    statusName: 'Canceled w/o delivery',
    idTag: '@5_O_DLVR_INTGR',
    isBtn: false,
    btnName: '',
    mockOrder: {
      status: ORDER_STATUSES.CANCELED,
      delivery: null,
      _id: generateID(),
    },
  },
  {
    statusName: 'Received',
    idTag: '@6_O_DLVR_INTGR',
    isBtn: false,
    btnName: '',
    mockOrder: {
      status: ORDER_STATUSES.RECEIVED,
      delivery: generateDeliveryData(),
      _id: generateID(),
      products: [{ ...generateProductData(), _id: generateID(), received: true }],
    },
  },
  {
    statusName: 'Partially Received',
    idTag: '@7_O_DLVR_INTGR',
    isBtn: false,
    btnName: '',
    mockOrder: {
      status: ORDER_STATUSES.PARTIALLY_RECEIVED,
      delivery: generateDeliveryData(),
      _id: generateID(),
      products: [
        { ...generateProductData(), _id: generateID(), received: false },
        { ...generateProductData(), _id: generateID(), received: true },
      ],
    },
  },
];
