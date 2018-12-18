import {restrictToPreOperations} from '../../src/index';
import {MethodNotAllowedException} from '@rxstack/exceptions';
import {OperationEventsEnum} from '@rxstack/platform';

describe('PlatformCallbacks:utils:restrict-to-pre-operations', () => {
  it('should pass', async () => {
    restrictToPreOperations(OperationEventsEnum.PRE_COLLECTION_READ);
  });

  it('should throw MethodNotAllowedException', async () => {
    let exception: MethodNotAllowedException;
    try {
      restrictToPreOperations(OperationEventsEnum.POST_READ);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});
