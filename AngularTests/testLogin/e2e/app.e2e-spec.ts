import { TestLoginPage } from './app.po';

describe('test-login App', function() {
  let page: TestLoginPage;

  beforeEach(() => {
    page = new TestLoginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
