import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {UserInterface} from '@rxstack/core';

export const getUserProperty = (user: UserInterface, propertyPath: string): any => {
  const userProp = _.get(user, propertyPath);
  if (!userProp) {
    throw new BadRequestException(`Current user is missing '${propertyPath}' field.`);
  }
  return userProp;
};