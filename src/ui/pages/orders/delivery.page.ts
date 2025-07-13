/* eslint-disable @typescript-eslint/no-unused-expressions */
import { COUNTRIES } from 'data/customers';
import { SalesPortalPage } from '../salePortal.page';
import { DATE_PICKER_MONTHS, DELIVERY_CONDITIONS } from 'data/orders';
import { IDeliveryOptionsUI } from 'types';
import { logStep } from 'utils';

export class DeliveryPage extends SalesPortalPage {
  readonly pageContainer = this.page.locator('#delivery-container');
  readonly title = this.pageContainer.locator('#title');

  // Inputs
  readonly typeInput = this.pageContainer.locator('#inputType');
  readonly locationInput = this.pageContainer.locator('#inputLocation');
  readonly countryInput = this.pageContainer.locator('[name="country"]');
  readonly cityInput = this.pageContainer.locator('#inputCity');
  readonly streetInput = this.pageContainer.locator('#inputStreet');
  readonly houseInput = this.pageContainer.locator('#inputHouse');
  readonly flatInput = this.pageContainer.locator('#inputFlat');

  // Datepicker
  readonly dateInputField = this.pageContainer.locator('#date-input');
  readonly dateInputIcon = this.pageContainer.locator('span.d-p-icon');
  readonly datepicker = this.page.locator('.datepicker');
  readonly datepickerSwitcherToMonths = this.datepicker.locator('.datepicker-days .datepicker-switch');
  readonly datepickerSwitcherToYears = this.datepicker.locator('.datepicker-months .datepicker-switch');
  readonly datepickerYear = (year: string) => this.datepicker.locator('.year', { hasText: year });
  readonly datepickerMonth = (month: DATE_PICKER_MONTHS) => this.datepicker.locator('.month', { hasText: month });
  readonly datepickerDay = (day: string) =>
    this.datepicker.locator(`td.day:not(.disabled):not(.old):not(.new):has-text('${day}')`);

  // Buttons
  readonly saveBtn = this.pageContainer.locator('#save-delivery');
  readonly cancelBtn = this.pageContainer.locator('#back-to-order-details-page');

  // Errors
  readonly countryError = this.pageContainer.locator('#error-inputCountry');
  readonly cityError = this.pageContainer.locator('#error-inputCity');
  readonly streetError = this.pageContainer.locator('#error-inputStreet');
  readonly houseError = this.pageContainer.locator('#error-inputHouse');
  readonly flatError = this.pageContainer.locator('#error-inputFlat');

  readonly uniqueElement = this.saveBtn;

  private async fillDateInput(date: string) {
    const parsedDate = new Date(date);
    const day = parsedDate.getDate().toString();
    const monthIndex = parsedDate.getMonth();
    const monthEnumValue = Object.values(DATE_PICKER_MONTHS)[monthIndex];
    const year = parsedDate.getFullYear().toString();

    await this.dateInputIcon.click();
    await this.datepickerSwitcherToMonths.click();
    await this.datepickerSwitcherToYears.click();
    await this.datepickerYear(year).click();
    await this.datepickerMonth(monthEnumValue).click();
    await this.datepickerDay(day).click();
  }

  @logStep('UI: Fill Edit/Schedule delivery inputs')
  async fillInputs(delivery: IDeliveryOptionsUI) {
    delivery.condition && (await this.typeInput.selectOption(delivery.condition));
    delivery.finalDate && (await this.fillDateInput(delivery.finalDate));
    if (delivery.condition === DELIVERY_CONDITIONS.PICK_UP) {
      delivery.address?.country && (await this.countryInput.selectOption(delivery.address.country));
      return;
    }
    delivery.location && (await this.locationInput.selectOption(delivery.location));
    if (delivery.location === 'Other') {
      delivery.address?.country && (await this.countryInput.selectOption(delivery.address.country));
      delivery.address?.city && (await this.cityInput.fill(delivery.address.city));
      delivery.address?.street && (await this.streetInput.fill(delivery.address.street));
      delivery.address?.house && (await this.houseInput.fill(delivery.address.house.toString()));
      delivery.address?.flat && (await this.flatInput.fill(delivery.address.flat.toString()));
    }
  }

  @logStep('UI: Get Edit/Schedule delivery inputs values')
  async getInputValues(): Promise<IDeliveryOptionsUI> {
    const [condition, finalDate, location, country, city, street, house, flat] = await Promise.all([
      this.typeInput.inputValue(),
      this.dateInputField.inputValue(),
      (await this.locationInput.isVisible()) && this.locationInput.inputValue(),
      this.countryInput.inputValue(),
      this.cityInput.inputValue(),
      this.streetInput.inputValue(),
      this.houseInput.inputValue(),
      this.flatInput.inputValue(),
    ]);
    const address = {
      country: (country as COUNTRIES) || undefined,
      city: city || undefined,
      street: street || undefined,
      house: house ? +house : undefined,
      flat: flat ? +flat : undefined,
    };
    return {
      condition: (condition as DELIVERY_CONDITIONS) || undefined,
      finalDate: finalDate || undefined,
      location: (location as IDeliveryOptionsUI['location']) || undefined,
      address,
    };
  }

  @logStep('UI: Click on Save Delivery button')
  async clickSave() {
    await this.saveBtn.click();
  }

  @logStep('UI: Click on Cancel button')
  async clickCancel() {
    await this.cancelBtn.click();
  }

  @logStep('UI: Get validation errors from Edit/Schedule delivery form')
  async getFormErrors() {
    return {
      country: (await this.countryError.isVisible()) ? await this.countryError.innerText() : null,
      city: (await this.cityError.isVisible()) ? await this.cityError.innerText() : null,
      street: (await this.streetError.isVisible()) ? await this.streetError.innerText() : null,
      house: (await this.houseError.isVisible()) ? await this.houseError.innerText() : null,
      flat: (await this.flatError.isVisible()) ? await this.flatError.innerText() : null,
    };
  }

  @logStep('UI: Check if address inputs are readonly')
  async areAddressInputsReadonly(includeCountry = true): Promise<boolean> {
    const inputs = [this.cityInput, this.streetInput, this.houseInput, this.flatInput];
    if (includeCountry) {
      inputs.push(this.countryInput);
    }
    const readonlyChecks = await Promise.all(inputs.map(async (input) => input.getAttribute('readonly')));

    return readonlyChecks.every((attr) => attr !== null);
  }
}
