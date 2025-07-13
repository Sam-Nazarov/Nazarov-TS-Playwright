import { test as setup } from 'fixtures';

const authFile = 'src/.auth/user.json';

setup('Login to Sales Portal', async ({ page, signInApiService }) => {
  const token = await signInApiService.loginAsLocalUser();
  await page.context().addCookies([
    {
      name: 'Authorization',
      value: token,
      domain: 'anatoly-karpovich.github.io',
      path: '/aqa-course-project',
      expires: -1,
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
  await page.context().storageState({ path: authFile });
});
