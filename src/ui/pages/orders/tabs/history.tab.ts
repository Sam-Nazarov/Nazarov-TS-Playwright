import { ORDER_HISTORY_ACTIONS } from 'data/orders';
import { OrderTab } from './tab.page';
import { logStep } from 'utils';
import { IDetailedHistoryItemUI, IHistoryItemUI } from 'types';
import { Locator } from '@playwright/test';

export class HistoryTab extends OrderTab {
  // Table headers
  readonly tableHeader = this.page.locator('.his-header');
  readonly actionHeader = this.tableHeader.filter({ hasText: 'Action' });
  readonly performerHeader = this.tableHeader.filter({ hasText: 'Performed By' });
  readonly dateHeader = this.tableHeader.filter({ hasText: 'Date & Time' });

  // Table Body
  readonly tableBody = this.page.locator('#history-body');
  readonly tableRow = this.tableBody.locator('.accordion');
  readonly latestTableRow = this.tableRow.first();
  readonly tableRowByAction = (action: ORDER_HISTORY_ACTIONS) => this.tableRow.filter({ hasText: action });
  readonly collapseBtnByAction = (action: ORDER_HISTORY_ACTIONS) => this.tableRowByAction(action).getByRole('button');

  readonly uniqueElement = this.tabContainer.locator('#history.active');

  private async parseHistoryHeader(row: Locator): Promise<IHistoryItemUI> {
    const tableRowHeader = row.locator('.accordion-header');
    const [action, performer, changedOn] = await Promise.all([
      tableRowHeader.locator('span').nth(0).innerText(),
      tableRowHeader.locator('span').nth(1).innerText(),
      tableRowHeader.locator('span').nth(2).innerText(),
    ]);
    return {
      action: action as ORDER_HISTORY_ACTIONS,
      performer,
      changedOn,
    };
  }

  private async getBodyRowValues(bodyRow: Locator): Promise<{ name: string; previous: string; updated: string }> {
    const [name, previous, updated] = await Promise.all([
      bodyRow.locator('span').nth(1).innerText(),
      bodyRow.locator('span').nth(2).innerText(),
      bodyRow.locator('span').nth(3).innerText(),
    ]);
    return {
      name,
      previous,
      updated,
    };
  }

  private async parseHistory(rows: Locator): Promise<IDetailedHistoryItemUI[]> {
    const historyItems: IDetailedHistoryItemUI[] = [];
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const currentRow = rows.nth(i);
      const header = await this.parseHistoryHeader(currentRow);
      const bodyRows = currentRow.locator('.accordion-collapse').locator('div.border-bottom');
      const rowsCount = await bodyRows.count();
      const bodyDetails: Record<string, { previous: string; updated: string }> = {};
      for (let j = 1; j < rowsCount; j++) {
        const bodyRow = bodyRows.nth(j);
        const { name, previous, updated } = await this.getBodyRowValues(bodyRow);
        bodyDetails[name] = { previous, updated };
      }
      historyItems.push({ header, details: bodyDetails });
    }
    return historyItems;
  }

  @logStep('UI: Get history list w/o details')
  async getHistoryList(): Promise<IHistoryItemUI[]> {
    const historyItems: IHistoryItemUI[] = [];
    const rows = await this.tableRow.count();
    for (let i = 0; i < rows; i++) {
      historyItems.push(await this.parseHistoryHeader(this.tableRow.nth(i)));
    }
    return historyItems;
  }

  @logStep('UI: Get latest history item w/o details')
  async getLatestHistoryItem(): Promise<IHistoryItemUI> {
    return await this.parseHistoryHeader(this.latestTableRow);
  }

  @logStep('UI: Get detailed latest history item')
  async getDetailedLatestHistoryItem(): Promise<IDetailedHistoryItemUI> {
    return (await this.parseHistory(this.latestTableRow))[0];
  }

  @logStep('UI: Get history item details by action')
  async getHistoryItemDetailsByAction(action: ORDER_HISTORY_ACTIONS): Promise<IDetailedHistoryItemUI[]> {
    const historyRow = this.tableRowByAction(action);
    return await this.parseHistory(historyRow);
  }

  @logStep('UI: Get full detailed history')
  async getFullDetailedHistory(): Promise<IDetailedHistoryItemUI[]> {
    return await this.parseHistory(this.tableRow);
  }

  @logStep('UI: Click collapse button by action')
  async clickCollapseButtonByAction(action: ORDER_HISTORY_ACTIONS) {
    const collapseButton = this.collapseBtnByAction(action);
    await collapseButton.click();
  }
}
