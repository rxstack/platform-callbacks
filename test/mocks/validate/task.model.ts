import {IsBoolean, IsNotEmpty, Length} from 'class-validator';

export class TaskModel {

  @IsNotEmpty({
    groups: ['group1']
  })
  id: string;

  @Length(2, 20, {
    groups: ['group2']
  })
  name: string;

  @IsBoolean({
    groups: ['group1']
  })
  completed: boolean;
}