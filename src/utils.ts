import fetchMock from 'fetch-mock';
import { diff } from 'jest-diff';

export function parseFetchOptions(call: fetchMock.MockCall) {
  if (!call[1] || !call[1].body) {
    return call[1];
  }

  let body;

  try {
    body = JSON.parse(call[1].body as any);
  } catch (e) {
    body = call[1].body;
  }

  return call[1].method
    ? { ...call[1], body, method: call[1].method }
    : { ...call[1], body };
}

export function filterByMethod(calls: fetchMock.MockCall[], method?: string) {
  return calls.filter(([_, i]) => {
    return i?.method?.toLowerCase() === method?.toLowerCase();
  });
}

export function buildFetchOptionsDiff(
  call: fetchMock.MockCall | fetchMock.MockCall[],
  assertionOptions: fetchMock.MockOptions,
  initialMessage?: string
): string {
  if (isMockCall(call)) {
    const options = parseFetchOptions(call);
    const optionsDiff = diff(options, assertionOptions);

    return optionsDiff ?? '';
  }

  return call.reduce((acc, prev, index) => {
    const header = `calls[${index}] ${prev[0]}`;
    const message = buildFetchOptionsDiff(prev, assertionOptions);

    if (!message) {
      return acc;
    }

    return `${acc}\n\n${header}\n\n${message}`;
  }, initialMessage ?? '');
}

export function isMockCall(
  calls: fetchMock.MockCall | fetchMock.MockCall[]
): calls is fetchMock.MockCall {
  return calls.hasOwnProperty('identifier');
}

export function isMockCallEqual(
  call1?: fetchMock.MockCall,
  call2?: fetchMock.MockCall
) {
  if (!call1 && !call2) return true;
  if (!call1 || !call2) return false;
  if (call1[0] !== call2[0]) return false;
  if (call1[1] !== call2[1]) return false;
  if (call1.request !== call2.request) return false;
  if (call1.identifier !== call2.identifier) return false;
  if (call1.isUnmatched !== call2.isUnmatched) return false;
  if (call1.response !== call2.response) return false;
  return true;
}
