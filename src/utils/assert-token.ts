import {TokenInterface} from '@rxstack/core';
import {UnauthorizedException} from '@rxstack/exceptions';

export const assertToken = (token: TokenInterface) => {
  if (!token) {
    throw new UnauthorizedException();
  }
};