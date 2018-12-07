import {Exclude, Expose} from 'class-transformer';

export class Task {

  @Expose({name: 'id', groups: ['group_id']})
  _id: string;

  @Expose({groups: ['group_name']})
  name: string;
}