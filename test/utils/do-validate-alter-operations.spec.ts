import {restrictToAlterOperations} from '../../src/index';
import {MethodNotAllowedException} from '@rxstack/exceptions';
import {OperationEventsEnum} from '@rxstack/platform';

describe('PlatformCallbacks:utils:restrict-to-alter-operations', () => {
  it('should pass', async () => {
    restrictToAlterOperations(OperationEventsEnum.POST_READ);
  });

  it('should throw MethodNotAllowedException', async () => {
    let exception: MethodNotAllowedException;
    try {
      restrictToAlterOperations(OperationEventsEnum.PRE_COLLECTION_READ);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});
