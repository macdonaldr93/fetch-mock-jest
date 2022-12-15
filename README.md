# fetch-mock-jest

This project is bootstrapped with [TSDX](https://tsdx.io/) 🙏.

## Installation

```
yarn add @bloombug/fetch-mock-jest -D

npm install -D fetch-mock-jest
```

## Usage

This library adds the following assertions.

- `expect(fetchMock).toHaveFetched(filter, options)`

**Note**: `filter` and `options` are the same as those used by [fetch-mock's inspection methods](https://www.wheresrhys.co.uk/fetch-mock/#api-inspectionfundamentals).

## Example

```tsx
import fetchMock from '@bloombug/fetch-mock-jest';
import {render, waitFor} from '@testing-library/react'

describe('<MyComponent />, () => {
  it('renders', () => {
    fetchMock.mock('/foobar');

    render(<MyComponent />);

    await screen.findByRole('heading', {name: 'Title'})

    expect(fetchMock).toHaveFetched('/foobar');
  });
});

```
