import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { generateCommentData } from 'data/orders';
import { commentTestData } from 'data/orders/testData';
import { errorResponseSchema, orderSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import { IOrderCommentRequest, IOrderFromResponse } from 'types';
import { generateID } from 'utils';
import { validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Add Comment]', () => {
  let token = '';
  let order: IOrderFromResponse;
  test.beforeEach(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    order = await ordersApiService.createDraft(token);
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should create a comment with all valid data (token, orderId, comment string)',
    {
      tag: ['@001_O_COMM_POST_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const commentText = generateCommentData();
      const orderWithCommentResponse = await ordersController.addComment(order._id, commentText, token);
      validateResponse(orderWithCommentResponse, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, orderWithCommentResponse.body);
      expect
        .soft(
          {
            ...orderWithCommentResponse.body.Order.comments.find((comment) => comment.text === commentText.comment),
          }.text,
        )
        .toMatch(commentText.comment);
    },
  );

  commentTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ ordersController }) => {
      const orderWithCommentResponse = await ordersController.addComment(
        data.orderId ?? order._id,
        data.body as IOrderCommentRequest,
        data.token ?? token,
      );
      validateResponse(orderWithCommentResponse, data.statusCode, false, data.error);
      validateSchema(errorResponseSchema, orderWithCommentResponse.body);
    });
  });

  test(
    'Should not create a comment with orderId invalid (non existing)',
    {
      tag: ['@006_O_COMM_POST_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const commentText = generateCommentData();
      const invalidOrderId = generateID();
      const orderWithCommentResponse = await ordersController.addComment(invalidOrderId, commentText, token);
      validateResponse(
        orderWithCommentResponse,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.ORDER_NOT_FOUND(invalidOrderId),
      );
      validateSchema(errorResponseSchema, orderWithCommentResponse.body);
    },
  );
});
