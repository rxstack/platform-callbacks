import {doValidateAlterOperations} from '../../src/index';
import {MethodNotAllowedException} from '@rxstack/exceptions';
import {OperationEventsEnum} from '@rxstack/platform';

describe('PlatformCallbacks:utils:do-valdate-alter-operations', () => {
  it('should pass', async () => {
    doValidateAlterOperations(OperationEventsEnum.POST_READ);
  });

  it('should throw MethodNotAllowedException', async () => {
    let exception: MethodNotAllowedException;
    try {
      doValidateAlterOperations(OperationEventsEnum.PRE_COLLECTION_READ);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});
