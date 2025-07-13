import { SalesPortalPage } from '../salePortal.page';
import { logStep } from 'utils';

export class ProductsPage extends SalesPortalPage {
  //header menu
  readonly addNewProductButton = this.page.getByRole('button', {
    name: 'Add Product',
  });
  //search
  readonly searchInput = this.page.locator('input[type="search"]');
  readonly searchButton = this.page.locator('#search-products');
  readonly chipButton = this.page.locator('.chip');
  readonly searchChipButton = this.page.locator('div[data-chip-products="search"]');

  //filter - modal window
  readonly filterButton = this.page.getByRole('button', { name: 'Filter' });

  //table
  readonly table = this.page.locator('#table-products');

  //table -headers
  readonly tableHeader = this.table.locator('th div[current]');
  readonly nameHeader = this.tableHeader.filter({ hasText: 'Name' });
  readonly priceHeader = this.tableHeader.filter({ hasText: 'Price' });
  readonly manufacturerHeader = this.tableHeader.filter({ hasText: 'Manufacturer' });
  readonly createdOnHeader = this.tableHeader.filter({ hasText: 'Created On' });

  //table -row
  readonly tableRow = this.table.locator('tbody tr');
  readonly tableRowByName = (name: string) => this.tableRow.filter({ has: this.page.getByText(name, { exact: true }) }); //точное совпадение name
  readonly nameCell = (name: string) => this.tableRowByName(name).locator('td').nth(0);
  readonly priceCell = (name: string) => this.tableRowByName(name).locator('td').nth(1);
  readonly manufacturerCell = (name: string) => this.tableRowByName(name).locator('td').nth(2);
  readonly createdOnCell = (name: string) => this.tableRowByName(name).locator('td').nth(3);
  readonly editButton = (name: string) => this.tableRowByName(name).getByTitle('Edit');
  readonly detailsButton = (name: string) => this.tableRowByName(name).getByTitle('Details');
  readonly deleteButton = (name: string) => this.tableRowByName(name).getByTitle('Delete');
  readonly emptyTableRow = this.page.locator('td.fs-italic');

  readonly uniqueElement = this.addNewProductButton;

  @logStep('Open Products page via URL')
  async open() {
    await this.openPage('PRODUCTS');
    await this.waitForOpened();
  }

  @logStep('UI: Click on Add New Product button on Product Page')
  async clickAddNewProduct() {
    await this.addNewProductButton.click();
  }

  @logStep('UI: Click on Delete Product button on Product Page')
  async clickDeleteProduct(productName: string) {
    await this.deleteButton(productName).click();
  }

  @logStep('UI: Click on Filter Button on Product Page')
  async clickFilter() {
    await this.filterButton.click();
  }

  @logStep('UI: Click on Table Action on Product Page')
  async clickTableAction(productName: string, action: 'edit' | 'details' | 'delete') {
    const buttons = {
      edit: this.editButton(productName),
      details: this.detailsButton(productName),
      delete: this.deleteButton(productName),
    };

    await buttons[action].click();
  }

  @logStep('UI: Fill Search Field on Product Page')
  async fillSearch(value: string | number) {
    await this.searchInput.fill(String(value));
  }

  @logStep('UI: Click on SearchButton on Product Page')
  async clickSearch() {
    await this.searchButton.click();
  }

  @logStep('UI: Perform Search on Product Page')
  async search(value: string | number) {
    await this.fillSearch(value);
    await this.clickSearch();
    await this.waitForOpened();
  }
}
