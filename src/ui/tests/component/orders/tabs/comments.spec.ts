import { apiConfig } from 'config';
import { TAGS, VALIDATION_ERROR_MESSAGES } from 'data';
import { generateCustomerData } from 'data/customers';
import { ORDER_STATUSES } from 'data/orders';
import { generateProductData } from 'data/products';
import { expect, test } from 'fixtures';
import { IOrderResponse } from 'types';
import { convertToDateAndTime, generateID } from 'utils';

test.describe('[UI] [Orders] [Component] Comments tab', () => {
  const mockOrder: IOrderResponse = {
    Order: {
      customer: { ...generateCustomerData(), _id: generateID(), createdOn: new Date().toISOString() },
      products: [{ ...generateProductData(), _id: generateID(), received: false }],
      createdOn: new Date().toISOString(),
      total_price: 100,
      comments: [
        {
          createdOn: new Date().toISOString(),
          text: 'Test comment',
          _id: generateID(),
        },
      ],
      history: [],
      assignedManager: null,
      status: ORDER_STATUSES.DRAFT,
      delivery: null,
      _id: generateID(),
    },
    IsSuccess: true,
    ErrorMessage: null,
  };

  test.beforeEach(async ({ mock, orderDetailsPage }) => {
    await mock.orderDetails(mockOrder.Order._id, mockOrder);

    await orderDetailsPage.open(mockOrder.Order._id);
    await orderDetailsPage.clickCommentsTab();
    await orderDetailsPage.commentsTab.waitForOpened();
  });

  test(
    'Title should be "Comments"',
    { tag: ['@1_O_CMNTS_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ orderDetailsPage }) => {
      await expect(orderDetailsPage.commentsTab.commentsTitle, 'Title is "Comments"').toHaveText('Comments');
    },
  );

  test(
    'Comments input should be visible and editable with placeholder "Enter a comment"',
    { tag: ['@2_O_CMNTS_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ orderDetailsPage }) => {
      await expect.soft(orderDetailsPage.commentsTab.commentsInput, 'Input is visible').toBeVisible();
      await expect.soft(orderDetailsPage.commentsTab.commentsInput, 'Input is editable').toBeEditable();
      await expect
        .soft(orderDetailsPage.commentsTab.commentsInput, 'Placeholder is "Enter a comment"')
        .toHaveAttribute('placeholder', 'Enter a comment');
    },
  );

  test(
    'Button "Create" is disabled when input is empty',
    { tag: ['@3_O_CMNTS_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ orderDetailsPage }) => {
      await expect.soft(orderDetailsPage.commentsTab.createBtn, 'Button is disabled').toBeDisabled();
      await orderDetailsPage.commentsTab.fillCommentsInput('A');
      await expect.soft(orderDetailsPage.commentsTab.createBtn, 'Button is enabled').toBeEnabled();
      await orderDetailsPage.commentsTab.clearCommentsInput();
      await expect.soft(orderDetailsPage.commentsTab.createBtn, 'Button is disabled').toBeDisabled();
    },
  );

  test(
    'Error message should be displayed when input is out of 1-250 characters range',
    { tag: ['@4_O_CMNTS_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ orderDetailsPage }) => {
      await orderDetailsPage.commentsTab.fillCommentsInput('A');
      await orderDetailsPage.commentsTab.clearCommentsInput();

      expect
        .soft(await orderDetailsPage.commentsTab.getCommentErrorMessage(), 'Error message is displayed')
        .toBe(VALIDATION_ERROR_MESSAGES.Comments);

      await orderDetailsPage.commentsTab.fillCommentsInput('A'.repeat(251));
      expect
        .soft(await orderDetailsPage.commentsTab.getCommentErrorMessage(), 'Error message is displayed')
        .toBe(VALIDATION_ERROR_MESSAGES.Comments);
    },
  );

  test(
    'Error message should be displayed when input contains < or > symbols',
    { tag: ['@5_O_CMNTS_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ orderDetailsPage }) => {
      await orderDetailsPage.commentsTab.fillCommentsInput('as<');

      expect
        .soft(await orderDetailsPage.commentsTab.getCommentErrorMessage(), 'Error message is displayed')
        .toBe(VALIDATION_ERROR_MESSAGES.Comments);

      await orderDetailsPage.commentsTab.clearCommentsInput();
      await orderDetailsPage.commentsTab.fillCommentsInput('as>');
      expect
        .soft(await orderDetailsPage.commentsTab.getCommentErrorMessage(), 'Error message is displayed')
        .toBe(VALIDATION_ERROR_MESSAGES.Comments);
    },
  );

  test(
    'Should send POST request with comment data when "Create" button is clicked',
    { tag: ['@6_O_CMNTS_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ orderDetailsPage }) => {
      const expectedCommentBody = {
        comment: 'Test',
      };
      await orderDetailsPage.commentsTab.fillCommentsInput(expectedCommentBody.comment);
      const request = await orderDetailsPage.interceptRequest(
        apiConfig.ENDPOINTS.ORDER_COMMENTS_ADD(mockOrder.Order._id),
        orderDetailsPage.commentsTab.clickCreateCommentButton.bind(orderDetailsPage.commentsTab),
      );

      expect.soft(request.url()).toBe(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDER_COMMENTS_ADD(mockOrder.Order._id));
      expect.soft(request.method(), 'Request method is POST').toBe('POST');
      expect.soft(request.postDataJSON(), 'Request body contains comment text').toEqual(expectedCommentBody);
    },
  );

  test(
    'Should render existing comments in the tab',
    { tag: ['@7_O_CMNTS_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ orderDetailsPage }) => {
      const expectedComment = {
        createdOn: convertToDateAndTime(mockOrder.Order.comments[0].createdOn),
        text: mockOrder.Order.comments[0].text,
        author: 'AQA User',
      };
      const commentId = mockOrder.Order.comments[0]._id;

      const actualComment = await orderDetailsPage.commentsTab.getCommentById(commentId);

      expect.soft(actualComment, 'Comment is rendered with correct data').toEqual(expectedComment);
      await expect.soft(orderDetailsPage.commentsTab.deletBtn(commentId), 'Delete button is visible').toBeVisible();
    },
  );

  test(
    'Should send DELETE request with comment data when "Delete" button is clicked',
    { tag: ['@8_O_CMNTS_CMPNT', TAGS.UI, TAGS.COMPONENT, TAGS.REGRESSION] },
    async ({ orderDetailsPage }) => {
      const commentId = mockOrder.Order.comments[0]._id;
      const request = await orderDetailsPage.interceptRequest(
        apiConfig.ENDPOINTS.ORDER_COMMENTS_DELETE(mockOrder.Order._id, commentId),
        orderDetailsPage.commentsTab.clickDeleteButton.bind(orderDetailsPage.commentsTab),
        commentId,
      );

      expect
        .soft(request.url())
        .toBe(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDER_COMMENTS_DELETE(mockOrder.Order._id, commentId));
      expect.soft(request.method(), 'Request method is DELETE').toBe('DELETE');
    },
  );
});
