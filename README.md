# Playwright Testing Project

## Project Setup

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Sam-Nazarov/Nazarov-TS-Playwright.git
cd Nazarov-TS-Playwright
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

```
USER_LOGIN=your_login
USER_PASSWORD=your_password
USER_ID=your_manager_id
```

Replace `your_login`, `your_password` and `your_manager_id` with valid credentials.

### 3. Running Tests

- **UI Tests:**

  ```bash
  npm run test:ui
  ```

- **API Tests:**

  ```bash
  npm run test:api
  ```

- **Update Snapshots:**

  ```bash
  npm run update-snapshots
  ```

- **Open Playwright UI Mode:**
  ```bash
  npm run ui-mode
  ```

### 4. Authentication Setup

By default, a setup step with login is executed before running UI or API tests.

If you need to run a specific test or suite as an unauthenticated user, you can reset the storage state for that test using the following code:

```typescript
// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });
```

### 5. Reports

- **Open Playwright HTML Report:**

  ```bash
  npm run report-html-open
  ```

- **Generate Allure Report:**

  ```bash
  npm run allure-report
  ```

- **Serve and Open Allure Report:**
  ```bash
  npm run allure-report-open
  ```
