import { apiConfig } from 'config';
import { ALERTS, TAGS } from 'data';
import { convertAPIProductStatusTOUI, convertProductToUIData } from 'data/orders';
import {
  errorResponseForAllProductsRequest,
  errorResponseForUpdateProduct,
  getAllProductsResponselist,
  orderInDraftStatus,
  orderInProcessStatus,
  orderWithDifferentStatuses,
  productDetails,
} from 'data/orders/testData';
import { expect, test } from 'fixtures';

test.describe('[Integration] [Orders] [Product Details]', () => {
  productDetails.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(el.response.Order._id, el.response);
      await orderDetailsPage.open(el.response.Order._id);
      const productInOrder = await orderDetailsPage.getProducts();
      expect(productInOrder[0]).toMatchObject(convertProductToUIData(el.response.Order.products[0]));
      console.log(convertProductToUIData(el.response.Order.products[0]));
      expect(productInOrder[0].status).toBe(convertAPIProductStatusTOUI(el.response.Order.products[0]));
    });
  });

  orderWithDifferentStatuses.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(el.response.Order._id, el.response);
      await orderDetailsPage.open(el.response.Order._id);
      expect(orderDetailsPage.editProductsButton).not.toBeVisible();
    });
  });

  test(
    'Should display edit button if order is in Draft status',
    { tag: TAGS.INTEGRATION },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDraftStatus.Order._id, orderInDraftStatus);
      await orderDetailsPage.open(orderInDraftStatus.Order._id);
      expect(orderDetailsPage.editProductsButton).toBeVisible();
    },
  );

  test(
    'Should display Receive button if order is in the In Process status',
    { tag: [TAGS.UI, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInProcessStatus.Order._id, orderInProcessStatus);
      await orderDetailsPage.open(orderInProcessStatus.Order._id);
      expect(orderDetailsPage.receiveButton).toBeVisible();
    },
  );

  test(
    'Should send correct request after clickin on Edit button (GetOrderByID)',
    { tag: [TAGS.UI, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDraftStatus.Order._id, orderInDraftStatus);
      await orderDetailsPage.open(orderInDraftStatus.Order._id);
      const request = await orderDetailsPage.interceptRequest(
        apiConfig.BASE_URL + apiConfig.ENDPOINTS.PRODUCTS_ALL,
        () => orderDetailsPage.clickEditProductsButton(),
      );
      expect(request.url()).toBe(apiConfig.BASE_URL + apiConfig.ENDPOINTS.PRODUCTS_ALL);
    },
  );

  test(
    'Should send Update Status request after clicing on Save button',
    { tag: [TAGS.UI, TAGS.INTEGRATION] },
    async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInProcessStatus.Order._id, orderInProcessStatus);
      await orderDetailsPage.open(orderInProcessStatus.Order._id);
      await orderDetailsPage.clickReceiveButton();
      await orderDetailsPage.markAllproducts('check');
      const request = await orderDetailsPage.interceptRequest(
        apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDER_RECEIVE(orderInProcessStatus.Order._id),
        () => orderDetailsPage.clickSaveButton(),
      );

      expect(request.url()).toBe(
        apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDER_RECEIVE(orderInProcessStatus.Order._id),
      );
      const requestBody = request.postDataJSON();
      expect(requestBody.products[0]).toBe(orderInProcessStatus.Order.products[0]._id);
    },
  );

  errorResponseForAllProductsRequest.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDraftStatus.Order._id, orderInDraftStatus);
      await orderDetailsPage.open(orderInDraftStatus.Order._id);
      await mock.allProducts(el.Response, el.statusCode);
      await orderDetailsPage.editProductsButton.click();
      await orderDetailsPage.waitForNotification(ALERTS.UPDATE_PRODCUT_UNABLED);
    });
  });

  errorResponseForUpdateProduct.forEach((el) => {
    test(el.testName, { tag: el.tag }, async ({ orderDetailsPage, mock }) => {
      await mock.orderDetails(orderInDraftStatus.Order._id, orderInDraftStatus);
      await orderDetailsPage.open(orderInDraftStatus.Order._id);
      await mock.allProducts(getAllProductsResponselist);
      await orderDetailsPage.clickEditProductsButton();
      await orderDetailsPage.editProductsModal.selectProduct(
        getAllProductsResponselist.Products[0].name,
        getAllProductsResponselist.Products[1].name,
      );
      await mock.orderDetails(orderInDraftStatus.Order._id, el.response, el.statusCode);
      await orderDetailsPage.editProductsModal.clickSaveButton();
      orderDetailsPage.waitForNotification(ALERTS.UPDATE_PRODUCT_FAILED);
    });
  });
});
