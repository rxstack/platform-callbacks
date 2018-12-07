import {InjectionToken, Type} from 'injection-js';
import {ServiceInterface} from '@rxstack/platform';
import {QueryInterface} from '@rxstack/query-filter';

export interface Constructable<T> {
  new(): T;
}

export type AlterMethod = 'pick' | 'omit';

export interface PopulateSchema<T> {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  parentField: string;
  childField: string;
  method?: string;
  nameAs?: string;
  query?: QueryInterface;
}

export interface CurrentUserOptions {
  idField?: string;
  targetField?: string;
}