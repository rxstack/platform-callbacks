import {ValidationSchema} from 'class-validator';

export const taskValidationSchema: ValidationSchema = {
  name: 'TaskValidationSchema',
  properties: {
    'id': [
      {
        type: 'isNotEmpty',
        groups: ['group1'],
      }
    ],
    'name': [
      {
        type: 'minLength',
        constraints: [3],
        groups: ['group2'],
      }
    ],
    'completed': [
      {
        type: 'isBoolean',
        groups: ['group1'],
      }
    ]
  }
};
