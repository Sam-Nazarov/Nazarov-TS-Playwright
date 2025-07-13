export enum DELIVERY_CONDITIONS {
  DELIVERY = 'Delivery',
  PICK_UP = 'Pickup',
}

export enum DELIVERY_INFO {
  DELIVERY_TYPE = 'Delivery Type',
  DELIVERY_DATE = 'Delivery Date',
  COUNTRY = 'Country',
  CITY = 'City',
  STREET = 'Street',
  HOUSE = 'House',
  FLAT = 'Flat',
}

export enum DATE_PICKER_MONTHS {
  JANUARY = 'Jan',
  FEBRUARY = 'Feb',
  MARCH = 'Mar',
  APRIL = 'Apr',
  MAY = 'May',
  JUNE = 'Jun',
  JULY = 'Jul',
  AUGUST = 'Aug',
  SEPTEMBER = 'Sep',
  OCTOBER = 'Oct',
  NOVEMBER = 'Nov',
  DECEMBER = 'Dec',
}

export const SHOP_ADDRESS_BY_COUNTRY = {
  USA: {
    city: 'Jefferson City',
    street: 'John Daniel Drive',
    house: 381,
    flat: 2,
  },
  Canada: {
    city: 'Halifax',
    street: 'Higginsville Road',
    house: 563,
    flat: 24,
  },
  Belarus: {
    city: 'Vitebsk',
    street: 'Frunze',
    house: 22,
    flat: 20,
  },
  Ukraine: {
    city: 'Yalta',
    street: 'Leningradskaya',
    house: 55,
    flat: 1,
  },
  Germany: {
    city: 'Altendorf',
    street: 'Luebecker Strasse',
    house: 41,
    flat: 3,
  },
  France: {
    city: 'Le Bouscat',
    street: 'boulevard Aristide Briand',
    house: 99,
    flat: 56,
  },
  'Great Britain': {
    city: 'Mickletown',
    street: 'Winchester Rd',
    house: 20,
    flat: 44,
  },
  Russia: {
    city: 'Chelyabinsk',
    street: 'Grazhdanskaya',
    house: 14,
    flat: 101,
  },
} as const;
