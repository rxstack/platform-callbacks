import {Injectable} from 'injection-js';
import {NoopService} from '../shared/noop.service';

@Injectable()
export class UserService extends NoopService {
  lastCriteria: Object;

  async findOne(criteria: Object): Promise<any> {
    this.lastCriteria = criteria;
    const id = criteria['id']['$eq'];
    switch (id) {
      case 'u-1':
        return { 'id': 'u-1', 'username': 'user-1' };
      case 'u-2':
        return { 'id': 'u-2', 'username': 'user-2' };
      default:
        return null;
    }
  }
}