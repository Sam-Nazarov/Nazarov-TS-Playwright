import { mergeTests } from '@playwright/test';
import { test as api_services } from './api-services.fixture';
import { test as controllers } from './controllers.fixture';
import { test as mock } from './mock.fixture';
import { test as pages } from './pages.fixture';

const test = mergeTests(api_services, controllers, mock, pages);

export { test };

export { expect } from '@playwright/test';
