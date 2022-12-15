import { FetchMockStatic } from 'fetch-mock';
import fetch from 'node-fetch';
import { toHaveFetched } from '../src/toHaveFetched';

jest.mock('node-fetch', () => require('fetch-mock').sandbox());

const fetchMock = (fetch as unknown) as FetchMockStatic;

describe('assertions', () => {
  describe('toHaveFetched()', () => {
    beforeEach(() => {
      fetchMock.reset();
    });

    it('returns pass', async () => {
      fetchMock.mock('https://google.ca', { foo: 'bar' });

      await fetch('https://google.ca');

      const assertion = toHaveFetched(fetchMock, 'https://google.ca', {
        method: 'GET',
      });

      expect(assertion.pass).toBeTruthy();
      expect(assertion.message()).toEqual('');
    });

    it('returns fail when there are no fetch requests', async () => {
      fetchMock.mock('https://google.ca', { foo: 'bar' });

      const assertion = toHaveFetched(fetchMock, 'https://google.ca', {
        method: 'GET',
      });

      expect(assertion.pass).toBeFalsy();
      expect(assertion.message()).toEqual('No fetch requests were made');
    });

    it('returns fail when the URL and method match', async () => {
      fetchMock.mock('https://google.ca', { foo: 'bar' });

      await fetch('https://google.ca', {
        method: 'POST',
        body: JSON.stringify({ foo: 'bar' }),
      });

      const assertion = toHaveFetched(fetchMock, 'https://google.ca', {
        method: 'POST',
        body: { foo: 'baz' },
      });

      expect(assertion.pass).toBeFalsy();
      expect(assertion.message()).toContain(
        'No fetch requests were made to https://google.ca'
      );
      expect(assertion.message()).toContain('calls[0] https://google.ca/');
      expect(assertion.message()).toContain('bar');
      expect(assertion.message()).toContain('baz');
    });
  });
});
