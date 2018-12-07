import {Injectable} from 'injection-js';
import {QueryInterface} from '@rxstack/query-filter';
import {data1, data2} from './data';
import {Task} from './task';
import {NoopService} from '../shared/noop.service';

@Injectable()
export class TaskService extends NoopService {
  async findMany(query: QueryInterface): Promise<Task[]> {
    const id = query.where['id']['$eq'];

    switch (id) {
      case 'id-1':
        return [data1];
      case 'id-2':
        return [data2];
      default:
        return [];
    }
  }
}