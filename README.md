# RxStack Platform Callbacks

[![Node.js CI](https://github.com/rxstack/platform-callbacks/actions/workflows/node.js.yml/badge.svg)](https://github.com/rxstack/platform-callbacks/actions/workflows/node.js.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/0c6cfc515a30d1a04c48/maintainability)](https://codeclimate.com/github/rxstack/platform-callbacks/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0c6cfc515a30d1a04c48/test_coverage)](https://codeclimate.com/github/rxstack/platform-callbacks/test_coverage)

> Set of helpers for [`@rxstack/platform`](https://github.com/rxstack/rxstack/tree/master/packages/platform)

## Table of content

- [Installation](#installation)
- [Callbacks](#callbacks)
    - [alter](#callbacks-alter)
    - [rename](#callbacks-rename)
    - [associateWithCurrentUser](#callbacks-associate-with-current-user)
    - [queryWithCurrentUser](#callbacks-query-with-current-user)
    - [restrictToAuthenticatedUser](#callbacks-restrict-to-authenticated-user)
    - [restrictToAnonymousUser](#callbacks-restrict-to-anonymous-user)
    - [restrictToOwner](#callbacks-restrict-to-owner)
    - [restrictToRole](#callbacks-restrict-to-role)
    - [objectExists](#callbacks-object-exists)
    - [populate](#callbacks-populate)
    - [queryFilter](#callbacks-query-filter)
    - [setNow](#callbacks-set-now)
    - [softDelete](#callbacks-soft-delete)
    - [transform](#callbacks-transform)
    - [validate](#callbacks-validate)
    - [validateUnique](#callbacks-validate-unique)


## <a name="installation"></a> Installation

```
npm install @rxstack/platform-callbacks --save
```

## <a name="callbacks"></a> Callbacks

> **Note:** `preExecute` applies changes on `request.body` and `postExecute` on `event.getData()`

### <a name="callbacks-alter"></a> alter

Pick or pluck properties in data

Available on:

- `preExecute`
- `postExecute`

`Options`: 

- `method`: [`lodash/pick`](https://lodash.com/docs/4.17.11#pick) | [`lodash/omit`](https://lodash.com/docs/4.17.11#omit)
- `fieldNames`: an array of field names.
- `dataPath`: path to data (optional)

Example: 

```typescript
// ...
import {alter} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    alter('pick', ['name', 'user.fname'])
  ],
  onPreExecute: [
    // ...
    alter('omit', ['_id', 'name'])
  ]
})
```

### <a name="callbacks-rename"></a> rename

Rename property and removes the original one.

Available on:

- `preExecute`
- `postExecute`

`Options`: 

- `key`: property name to rename
- `newKey`: new property name
- `dataPath`: path to data (optional)

Example: 

```typescript
// ...
import {rename} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    rename('title', 'name')
  ],
  onPreExecute: [
    // ...
    rename('_id', 'id', 'user')
  ]
})
```

### <a name="callbacks-associate-with-current-user"></a> associateWithCurrentUser

Adds current user identifier to `request.body`.

Available on:

- `preExecute`

`Options`: 

- `options: CurrentUserOptions` 
    - `idField`: user identifier property. Optional, defaults to `id`
    - `targetField`: property where `user identifier` should be set. Optional, defaults to `userId`

Example: 

```typescript
// ...
import {associateWithCurrentUser} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    associateWithCurrentUser({idField: 'username', targetField: 'owner'})
  ]
})
```

### <a name="callbacks-query-with-current-user"></a> queryWithCurrentUser

Adds current user identifier to `request.attributes.get('query')` or `request.attributes.get('criteria')`.

Available on:

- `preExecute`

`Options`: 

- `options: CurrentUserOptions` 
    - `idField`: user identifier property. Optional, defaults to `id`
    - `targetField`: property where `user identifier` should be set. Optional, defaults to `userId`

Example: 

```typescript
// ...
import {queryWithCurrentUser} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    queryWithCurrentUser({idField: 'username', targetField: 'owner'})
  ]
})
```

### <a name="callbacks-restrict-to-authenticated-user"></a> restrictToAuthenticatedUser

Restricts resource to authenticated user `request.token`.

Available on:

- `preExecute`

`Options`: 

- `fullyAuthenticated`: if user is fully authenticated (token is not refreshed) (optional)

Example: 

```typescript
// ...
import {restrictToAuthenticatedUser} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    restrictToAuthenticatedUser(false)
  ]
})
```

### <a name="callbacks-restrict-to-anonymous-user"></a> restrictToAnonymousUser

Restricts resource to anonymous user `request.token`.

Available on:

- `preExecute`

Example: 

```typescript
// ...
import {restrictToAnonymousUser} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    restrictToAnonymousUser()
  ]
})
```

### <a name="callbacks-restrict-to-owner"></a> restrictToOwner

Restricts resource to current user `request.token.getUser()`.

Available on:

- `preExecute`

`Options`: 

- `options: CurrentUserOptions` 
    - `idField`: user identifier property. Optional, defaults to `id`
    - `targetField`: property where `user identifier` should be get. Optional, defaults to `userId`

Example: 

```typescript
// ...
import {restrictToOwner} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    restrictToOwner({idField: 'username', targetField: 'owner'})
  ]
})
```

### <a name="callbacks-restrict-to-role"></a> restrictToRole

Restricts resource to current user role `request.token.getRoles()`.

Available on:

- `preExecute`

`Options`: 

- `role`: role to match 

Example: 

```typescript
// ...
import {restrictToRole} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    restrictToRole('ROLE_ADMIN')
  ]
})
```

### <a name="callbacks-object-exists"></a> objectExists

Checks if object exists in database.

Available on:

- `preExecute`

`Options`: 

- `schema: ObjectExistSchema<T>`
    - `service`: The type of service to fetch the record
    - `targetField`: field in the `request.body`
    - `inverseField`: field in the service model 
    - `method`: service method (optional),  defaults to `findOne`
    - `criteria`: additional criteria (optional) [see here](https://github.com/rxstack/rxstack/tree/master/packages/platform#services-querying)
    - `dataPath`: path to data (optional)

Example: 

```typescript
// ...
import {objectExists} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    objectExists({
      service: UserService,
      targetField: 'user',
      inverseField: 'username',
      method: 'findOne',
      criteria: {id: {'$ne': 'user-2'}},
      dataPath: 'posts'
    })
  ]
})
```

### <a name="callbacks-populate"></a> populate

Joins related records.

Available on:

- `postExecute`

`Options`: 

- `schema: PopulateSchema<T>`
    - `service`: The type of service to fetch the records
    - `targetField`: field in the `event.getData()`
    - `inverseField`: field in the service model 
    - `method`: service method (optional), defaults to `findMany`
    - `nameAs`: replaces the original property name (optional)
    - `query`: additional query (optional) [see here](https://github.com/rxstack/rxstack/tree/master/packages/platform#services-querying)

Example: 

```typescript
// ...
import {populate} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPostExecute: [
    // ...
    populate({
      service: UserService,
      targetField: 'users',
      inverseField: 'username',
      method: 'findMany',
      query: {where: {enabled: {'$eq': true}}, limit: 5, skip: 0, sort: { id: -1 } },
      nameAs: 'owners'
    })
  ]
})
```

### <a name="callbacks-populate"></a> queryFilter

Filter the query with [`@rxstack/query-filter`](https://github.com/rxstack/rxstack/tree/master/packages/query-filter).
Modifies `request.attributes.get('query')`.

Available on:

- `preExecute`

`Options`: 

- `schema: QueryFilterSchema`

Example: 

```typescript
// ...
import {queryFilter} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    queryFilter(taskQuerySchema)
  ]
})
```

### <a name="callbacks-set-now"></a> setNow

Set the current date-time in certain fields

Available on:

- `preExecute`
- `postExecute`

`Options`: 

- `fieldNames`: array of field names.

Example: 

```typescript
// ...
import {setNow} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    setNow('createdAt', 'updatedAt')
  ]
})
```

### <a name="callbacks-soft-delete"></a> softDelete

Flag records as logically deleted instead of physically removing them (sets the deleted date). 
It can be used only with [`ResurceOperations`](https://github.com/rxstack/rxstack/tree/master/packages/platform#operations)
Internally it modifies the `request.attributes.get(query)` or checks if `deleteField` is null

> **Important:** make sure you add it last on remove operations because it will skip the remaining hooks.

Available on:

- `preExecute`

`Options`: 

- `schema: SoftDeleteOptions`
    - `addOnCreate`: Adds delete field with `null` value on create operations (optional), defaults to `false`
    - `deleteField`: name of the field to set the date when the record was logically deleted (optional), defaults to `deletedAt`

Example: 

```typescript
// ...
import {softDelete} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    softDelete({
      addOnCreate: true,
      deleteField: 'deletedAt'
    })
  ]
})
```

### <a name="callbacks-transform"></a> transform

Transforms values from `request.body` or `event.getData()`. It uses [`class-transformer`](https://github.com/typestack/class-transformer)

Available on:

- `preExecute`
- `postExecute`

`Options`: 

- `type`: Target which Types are being specified.
- `options`: [ClassTransformOptions](https://github.com/typestack/class-transformer/blob/develop/src/ClassTransformOptions.ts)

Example: 

first create the model:

```typescript
import {Expose} from 'class-transformer';

export class TaskTransformer {

  @Expose({name: 'id'})
  _id: string;

  @Expose({groups: ['create']})
  name: string;
}
```

then add the hook to operation:

```typescript
// ...
import {transform} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    transform(TaskTransformer, {groups: ['create']})
  ]
})
```

### <a name="callbacks-validate"></a> validate

Validates object(s) using [class-validator](https://github.com/typestack/class-validator)

Available on:

- `preExecute`

`Options`: 

- `type`: validation schema or target which types are being specified.
- `options`: [`ValidatorOptions`](https://github.com/typestack/class-validator/blob/master/src/validation/ValidatorOptions.ts) (optional)


Example with type: 

```typescript
// ...
import {validate} from '@rxstack/platform-callbacks';
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

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    validate(TaskModel, { groups: ['group1'] })
  ]
})
```

### <a name="callbacks-validate-unique"></a> validateUnique

Validates that a particular field (or fields) is (are) unique.

Available on:

- `preExecute`

`Options`: 

- `service`: The type of service to fetch the records
- `properties`: List of fields on which this object should be unique
- `errorPath`: the path where the error should be mapped
- `method`: service method (optional), defaults to `findMany`
- `message`: error message (optional), default to `Value is not unique`

Example: 

```typescript
// ...
import {validateUnique} from '@rxstack/platform-callbacks';

@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPreExecute: [
    // ...
    validateUnique({
      service: TaskService,
      properties: ['name'],
      errorPath: 'name',
      method: 'findMany',
      message: 'Property name should be unique'
    })
  ]
})
```

## License

Licensed under the [MIT license](LICENSE).
