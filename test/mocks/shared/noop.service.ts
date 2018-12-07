import {Injectable} from 'injection-js';
import {QueryInterface, SortInterface} from '@rxstack/query-filter';
import {ServiceInterface, ServiceOptions} from '@rxstack/platform';

@Injectable()
export class NoopService implements ServiceInterface<any> {

  options: ServiceOptions = { idField: 'id' };

  async insertOne(data: Object): Promise<any> {
    return data;
  }

  insertMany(data: Object[]): Promise<any[]> {
    return undefined;
  }

  async updateOne(id: any, data: Object): Promise<any> {
    return data;
  }

  updateMany(criteria: Object, data: Object): Promise<number> {
    return undefined;
  }

  async removeOne(id: any): Promise<void> { }

  async removeMany(criteria: Object): Promise<number> {
    return 0;
  }

  async count(criteria?: Object): Promise<number> {
    return 0;
  }

  async findOne(criteria: Object, sort?: SortInterface): Promise<any> {
    return null;
  }

  async findMany(query: QueryInterface): Promise<any[]> {
    return [ ];
  }
}