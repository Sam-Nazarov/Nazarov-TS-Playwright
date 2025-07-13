import { DELIVERY_CONDITIONS, DELIVERY_INFO } from 'data/orders';
import { OrderTab } from './tab.page';
import { logStep } from 'utils';
import { DeliveryHistoryUI } from 'types';

export class DeliveryTab extends OrderTab {
  readonly deliveryBtn = this.tabContainer.locator('#delivery-btn');
  readonly deliveryTitle = this.title('delivery');
  private readonly deliveryOptions = this.tabContainer.locator('.c-details');
  private readonly optionLocators = {
    [DELIVERY_INFO.DELIVERY_TYPE]: this.getOptionValueLocator(DELIVERY_INFO.DELIVERY_TYPE),
    [DELIVERY_INFO.DELIVERY_DATE]: this.getOptionValueLocator(DELIVERY_INFO.DELIVERY_DATE),
    [DELIVERY_INFO.COUNTRY]: this.getOptionValueLocator(DELIVERY_INFO.COUNTRY),
    [DELIVERY_INFO.CITY]: this.getOptionValueLocator(DELIVERY_INFO.CITY),
    [DELIVERY_INFO.STREET]: this.getOptionValueLocator(DELIVERY_INFO.STREET),
    [DELIVERY_INFO.HOUSE]: this.getOptionValueLocator(DELIVERY_INFO.HOUSE),
    [DELIVERY_INFO.FLAT]: this.getOptionValueLocator(DELIVERY_INFO.FLAT),
  };

  readonly uniqueElement = this.tabContainer.locator('#delivery.active');

  private getOptionValueLocator(option: DELIVERY_INFO) {
    return this.deliveryOptions
      .filter({
        has: this.page.locator('span.strong-details', { hasText: option }),
      })
      .locator('span:not(.strong-details)');
  }

  @logStep('UI: Get delivery option value')
  async getOptionValue(option: DELIVERY_INFO): Promise<string> {
    return this.optionLocators[option].innerText();
  }

  @logStep('UI: Click Edit/Schedule delivery button')
  async clickDeliveryButton() {
    await this.deliveryBtn.click();
  }

  @logStep('UI: Get full delivery info')
  async getDeliveryInfo(): Promise<DeliveryHistoryUI> {
    const [condition, finalDate, country, city, street, house, flat] = await Promise.all([
      this.getOptionValue(DELIVERY_INFO.DELIVERY_TYPE),
      this.getOptionValue(DELIVERY_INFO.DELIVERY_DATE),
      this.getOptionValue(DELIVERY_INFO.COUNTRY),
      this.getOptionValue(DELIVERY_INFO.CITY),
      this.getOptionValue(DELIVERY_INFO.STREET),
      this.getOptionValue(DELIVERY_INFO.HOUSE),
      this.getOptionValue(DELIVERY_INFO.FLAT),
    ]);
    return {
      condition: condition as DELIVERY_CONDITIONS,
      finalDate,
      address: {
        country: country as DeliveryHistoryUI['address']['country'],
        city,
        street,
        house: +house || '-',
        flat: +flat || '-',
      },
    };
  }
}
