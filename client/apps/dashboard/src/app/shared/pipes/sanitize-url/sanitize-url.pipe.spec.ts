import {SanitizeUrlPipe} from './sanitize-url.pipe';

describe('SanitizeUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
