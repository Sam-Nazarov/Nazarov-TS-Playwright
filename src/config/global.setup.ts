import path from 'path';
import { rimraf } from 'rimraf';

export default function globalSetup() {
  const resultsPath = path.resolve(__dirname, 'allure-results');
  rimraf.sync(resultsPath);
}
