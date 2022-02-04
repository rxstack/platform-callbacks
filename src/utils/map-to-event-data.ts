import {OperationEvent} from '@rxstack/platform';
import {getSource} from './get-source';
import * as _ from 'lodash';
import {setSource} from './set-source';

export const mapToEventData = (event: OperationEvent, method: (...args: any[]) => void, args: any[]): void => {
  const source = getSource(event);
  let data: any;
  if (_.isArray(source)) {
    data = source.map(value => {
      const clonedArgs = _.cloneDeep(args);
      clonedArgs.unshift(value);
      return method(...clonedArgs);
    });
  } else {
    args.unshift(source);
    data = method(...args);
  }
  setSource(event, data);
};
