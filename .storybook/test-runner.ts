import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    const image = await page.screenshot({ animations: 'disabled' });
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: context.id,
    });
  },
};
export default config;
