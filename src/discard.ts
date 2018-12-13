import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import * as _ from 'lodash';
import {doAlter} from './utils/do-alter';
import {doValidateAlterOperations} from './utils/do-validate-alter-operations';
import {getSource} from './utils/get-source';
import {setSource} from './utils/set-source';

export const discard = (fieldNames: string[], propertyPath?: string): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    doValidateAlterOperations(event.eventType);
    const source = getSource(event);
    const data = _.isArray(source) ? source.map(value => doAlter('omit', value, fieldNames, propertyPath)) :
      doAlter('omit', source, fieldNames, propertyPath);
    setSource(event, data);
  };
};
