import { fireEvent, render, screen } from '@testing-library/react';

import { JwtDecoder } from './jwt-decoder.client';

export const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiQWxpY2UifQ.signature';

export function decodeToken(token = validToken) {
  render(<JwtDecoder />);
  fireEvent.change(screen.getByLabelText('JWT token'), { target: { value: token } });
  fireEvent.click(screen.getByRole('button', { name: 'Decode token' }));
}
