import {Injectable} from 'injection-js';
import {QueryInterface} from '@rxstack/query-filter';
import {NoopService} from '../shared/noop.service';

@Injectable()
export class UserService extends NoopService {

  lastQuery: QueryInterface;

  async findMany(query: QueryInterface): Promise<any[]> {
    this.lastQuery = query;
    return [
      {
        'id': 'u-1',
        'username': 'user1',
      },
      {
        'id': 'u-2',
        'username': 'user2',
      }
    ];
  }

  async customMethod(query: QueryInterface): Promise<any[]> {
    this.lastQuery = query;
    return [
      {
        'id': 'u-1',
        'username': 'user1',
      },
    ];
  }
}