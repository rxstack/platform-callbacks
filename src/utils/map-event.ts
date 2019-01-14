import {OperationEvent} from '@rxstack/platform';
import {getSource} from './get-source';
import * as _ from 'lodash';
import {setSource} from './set-source';

export const mapEvent = (event: OperationEvent, method: Function, args: any[]): void => {
  const source = getSource(event);
  let data: any;
  if (_.isArray(source)) {
    data = source.map(value => {
      const clonedArgs = _.cloneDeep(args);
      clonedArgs.unshift(value);
      return method.apply(null, clonedArgs);
    });
  } else {
    args.unshift(source);
    data = method.apply(null, args);
  }
  setSource(event, data);
};