import { logStep } from 'utils';
import { SalesPortalPage } from '../salePortal.page';

export class CustomersPage extends SalesPortalPage {
  //header menu
  readonly addNewCustomerButton = this.page.getByRole('button', {
    name: 'Add Customer',
  });
  //search
  readonly searchInput = this.page.locator('input[type="search"]');
  readonly searchButton = this.page.locator('#search-customer');
  readonly chipButton = this.page.locator('.chip');
  readonly searchChipButton = this.page.locator('div[data-chip-customers="search"]');

  //filter - modal window
  readonly filterButton = this.page.getByRole('button', { name: 'Filter' });

  //table
  readonly table = this.page.locator('#table-customers');

  //table -headers
  readonly tableHeader = this.table.locator('th div[current]');
  readonly emailHeader = this.tableHeader.filter({ hasText: 'Email' });
  readonly nameHeader = this.tableHeader.filter({ hasText: 'Name' });
  readonly countryHeader = this.tableHeader.filter({ hasText: 'Country' });
  readonly createdOnHeader = this.tableHeader.filter({ hasText: 'Created On' });

  //table -row
  readonly tableRow = this.table.locator('tbody tr');
  readonly tableRowByEmail = (email: string) => this.tableRow.filter({ has: this.page.getByText(email) });
  readonly emailCell = (email: string) => this.tableRowByEmail(email).locator('td').nth(0);
  readonly nameCell = (email: string) => this.tableRowByEmail(email).locator('td').nth(1);
  readonly countryCell = (email: string) => this.tableRowByEmail(email).locator('td').nth(2);
  readonly createdOnCell = (email: string) => this.tableRowByEmail(email).locator('td').nth(3);
  readonly editButton = (email: string) => this.tableRowByEmail(email).getByTitle('Edit');
  readonly detailsButton = (email: string) => this.tableRowByEmail(email).getByTitle('Details');
  readonly deleteButton = (email: string) => this.tableRowByEmail(email).getByTitle('Delete');
  readonly emptyTableRow = this.page.locator('td.fs-italic');

  readonly uniqueElement = this.addNewCustomerButton;

  @logStep('Open Customers page via URL')
  async open() {
    await this.openPage('CUSTOMERS');
    await this.waitForOpened();
  }

  @logStep('UI: Click on Add New Customer button on CustomersPage')
  async clickAddNewCustomer() {
    await this.addNewCustomerButton.click();
  }

  @logStep('UI: Click on Delete Customer button on CustomersPage')
  async clickDeleteCustomer(customerEmail: string) {
    await this.deleteButton(customerEmail).click();
  }

  @logStep('UI: Click on Filter Button on Customers Page')
  async clickFilter() {
    await this.filterButton.click();
  }

  @logStep('UI: Click on Table Action on CustomersPage')
  async clickTableAction(customerEmail: string, action: 'edit' | 'details' | 'delete') {
    const buttons = {
      edit: this.editButton(customerEmail),
      details: this.detailsButton(customerEmail),
      delete: this.deleteButton(customerEmail),
    };

    await buttons[action].click();
  }

  @logStep('UI: Fill Search Field on CustomersPage')
  async fillSearch(value: string | number) {
    await this.searchInput.fill(String(value));
  }

  @logStep('UI: Click on SearchButton on CustomersPage')
  async clickSearch() {
    await this.searchButton.click();
  }

  @logStep('UI: Perform Search on CustomersPage')
  async search(value: string | number) {
    await this.fillSearch(value);
    await this.clickSearch();
    await this.waitForOpened();
  }
}
