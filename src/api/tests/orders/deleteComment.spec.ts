import { API_ERRORS, STATUS_CODES, TAGS } from 'data';
import { deleteCommentTestData } from 'data/orders/testData';
import { errorResponseSchema } from 'data/schemas';
import { expect, test } from 'fixtures';
import { IOrderFromResponse, IResponse, IResponseFields } from 'types';
import { generateID } from 'utils';
import { validateDeleteResponse, validateResponse, validateSchema } from 'utils/validations';

test.describe('[API] [Orders] [Add Comment]', () => {
  let token = '';
  let order: IOrderFromResponse;
  test.beforeEach(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.getAuthToken();
    order = await ordersApiService.createDraft(token);
    order = await ordersApiService.addComment(order._id, token);
  });

  test.afterEach(async ({ ordersApiService }) => {
    await ordersApiService.clear(token);
  });

  test(
    'Should delete a comment with all valid data (token, orderId, commentId)',
    { tag: ['@001_O_COMM_DELETE_API', TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ ordersController, ordersApiService }) => {
      const deleteCommentResponse = await ordersController.deleteComment(order._id, order.comments[0]._id, token);
      validateDeleteResponse(deleteCommentResponse);
      order = await ordersApiService.getById(order._id, token);
      expect(order.comments).toEqual([]);
    },
  );

  deleteCommentTestData.forEach((data) => {
    test(data.testName, { tag: data.tag }, async ({ ordersController }) => {
      const deleteCommentResponse = await ordersController.deleteComment(
        data.orderId ?? order._id,
        data.commentID ?? order.comments[0]._id,
        data.token ?? token,
      );
      validateResponse(
        deleteCommentResponse as unknown as IResponse<IResponseFields>,
        data.statusCode,
        false,
        data.error,
      );
      validateSchema(errorResponseSchema, deleteCommentResponse.body as unknown as IResponse<IResponseFields>);
    });
  });

  test(
    'Should not delete a comment with orderId invalid (non existing)',
    { tag: ['@006_O_COMM_DELETE_API', TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const invalidOrderId = generateID();
      const deleteCommentResponse = await ordersController.deleteComment(invalidOrderId, order.comments[0]._id, token);
      validateResponse(
        deleteCommentResponse as unknown as IResponse<IResponseFields>,
        STATUS_CODES.NOT_FOUND,
        false,
        API_ERRORS.ORDER_NOT_FOUND(invalidOrderId),
      );
      validateSchema(errorResponseSchema, deleteCommentResponse.body as unknown as IResponse<IResponseFields>);
    },
  );

  test(
    'Should not delete a comment with commentId invalid',
    {
      tag: ['@008_O_COMM_DELETE_API', TAGS.API, TAGS.REGRESSION],
    },
    async ({ ordersController }) => {
      const invalidCommentId = generateID();
      const deleteCommentResponse = await ordersController.deleteComment(order._id, invalidCommentId, token);
      validateResponse(
        deleteCommentResponse as unknown as IResponse<IResponseFields>,
        STATUS_CODES.BAD_REQUEST,
        false,
        API_ERRORS.COMMENT_NOT_FOUND,
      );
      validateSchema(errorResponseSchema, deleteCommentResponse.body as unknown as IResponse<IResponseFields>);
    },
  );
});
