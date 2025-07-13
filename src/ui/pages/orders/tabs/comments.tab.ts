import { logStep } from 'utils';
import { OrderTab } from './tab.page';
import { IComment } from 'types';
import { Locator } from '@playwright/test';

export class CommentsTab extends OrderTab {
  readonly commentsInput = this.tabContainer.locator('#textareaComments');
  readonly createBtn = this.tabContainer.locator('#create-comment-btn');
  readonly commentsTitle = this.title('comments');

  // Existing comments
  readonly deletBtn = (commentId: string) => this.tabContainer.locator(`[id="${commentId}"]`);
  private commentItems = this.tabContainer.locator('div.border');
  readonly commentItemById = (commentId: string) => this.tabContainer.locator(`div.border:has([id="${commentId}"])`);
  readonly commentItemByText = (text: string) => this.commentItems.filter({ hasText: text });

  readonly uniqueElement = this.tabContainer.locator('#comments.active');

  @logStep('UI: Fill comments input')
  async fillCommentsInput(text: string) {
    await this.commentsInput.fill(text);
  }

  @logStep('UI: Click Create Comment button')
  async clickCreateCommentButton() {
    await this.createBtn.click();
  }

  @logStep('UI: Clear comments input')
  async clearCommentsInput() {
    await this.commentsInput.fill('');
  }

  @logStep('UI: Get comments input value')
  async getCommentsInputValue(): Promise<string> {
    return this.commentsInput.inputValue();
  }

  private async parseComment(commentElement: Locator): Promise<IComment> {
    const [text, author, createdOn] = await Promise.all([
      commentElement.locator('p').innerText(),
      commentElement.locator('span.text-primary').innerText(),
      commentElement.locator('div.text-muted > span:not(.text-primary)').innerText(),
    ]);
    return {
      text,
      author,
      createdOn,
    };
  }

  @logStep('UI: Get comment by ID')
  async getCommentById(commentId: string): Promise<IComment> {
    const commentElement = this.commentItemById(commentId);
    return this.parseComment(commentElement);
  }

  @logStep('UI: Get comments by text')
  async getCommentsByText(text: string): Promise<IComment[]> {
    const commentElements = this.commentItemByText(text);
    const count = await commentElements.count();
    if (count === 0) {
      throw new Error(`Comment with text "${text}" not found`);
    }
    const comments: IComment[] = [];
    for (let i = 0; i < count; i++) {
      comments.push(await this.parseComment(commentElements.nth(i)));
    }
    return comments;
  }

  @logStep('UI: Get all comments')
  async getAllComments(): Promise<IComment[]> {
    const comments: IComment[] = [];
    const count = await this.commentItems.count();
    for (let i = 0; i < count; i++) {
      comments.push(await this.parseComment(this.commentItems.nth(i)));
    }
    return comments;
  }

  @logStep('UI: Click delete button for comment')
  async clickDeleteButton(commentId: string) {
    await this.deletBtn(commentId).click();
  }

  @logStep('UI: Get comment error message')
  async getCommentErrorMessage(): Promise<string> {
    return this.tabContainer.locator('#error-textareaComments').innerText();
  }
}
