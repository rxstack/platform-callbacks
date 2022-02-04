import {InjectionToken, Type} from 'injection-js';
import {ServiceInterface} from '@rxstack/platform';
import {QueryInterface} from '@rxstack/query-filter';

export type AlterMethod = 'pick' | 'omit';

export interface SoftDeleteOptions {
  deleteField?: string;
  addOnCreate?: boolean;
}

export interface ObjectExistSchema<T> {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  targetField: string;
  inverseField: string;
  method?: string;
  criteria?: Record<string, any>;
  dataPath?: string;
}

export interface PopulateSchema<T> {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  targetField: string;
  inverseField: string;
  method?: string;
  nameAs?: string;
  query?: QueryInterface;
}

export interface CurrentUserOptions {
  idField?: string;
  targetField?: string;
}

export interface ValidateUniqueOptions {
  service: Type<ServiceInterface<any>> | InjectionToken<ServiceInterface<any>>;
  properties: string[];
  errorPath: string;
  method?: string;
  message?: string;
}
