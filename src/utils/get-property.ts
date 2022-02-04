import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';

export const getProperty = (obj: Record<string, any>, propertyPath: string): any => {
  const value = _.get(obj, propertyPath);
  if (!value) {
    throw new BadRequestException(`Current object is missing '${propertyPath}' field.`);
  }
  return value;
};
