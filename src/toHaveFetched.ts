import { expect } from '@jest/globals';
import fetchMock, { FetchMockStatic } from 'fetch-mock';
import { buildFetchOptionsDiff, filterByMethod } from './utils';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveFetched(
        filter: fetchMock.InspectionFilter,
        options: fetchMock.MockOptions
      ): R;
    }
  }
}

export function toHaveFetched(
  fetchMock: FetchMockStatic,
  filter: fetchMock.InspectionFilter,
  options: fetchMock.MockOptions
): jest.CustomMatcherResult {
  if (fetchMock.called(filter, options)) {
    return { pass: true, message: () => '' };
  }

  const allCalls = fetchMock.calls();

  if (allCalls.length === 0) {
    return {
      pass: false,
      message: () => `No fetch requests were made`,
    };
  }

  const baseMessage = `No fetch requests were made to ${filter}`;
  const matchedCalls = fetchMock.calls(filter);

  if (matchedCalls.length > 0) {
    const calls = filterByMethod(matchedCalls, options?.method);
    const diffMessage = buildFetchOptionsDiff(calls, options, baseMessage);

    if (calls.length > 0) {
      return {
        pass: false,
        message: () => diffMessage,
      };
    }
  }

  return {
    pass: false,
    message: () => baseMessage,
  };
}

expect.extend({
  toHaveFetched: (
    filter: fetchMock.InspectionFilter,
    options: fetchMock.MockOptions
  ) => toHaveFetched(fetchMock, filter, options),
});
