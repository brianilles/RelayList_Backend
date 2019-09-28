### Users

## Endpoints

| HTTP METHOD | Endpoint                            | Description                    | Cookies Required |
| ----------- | ----------------------------------- | ------------------------------ | ---------------- |
| GET         | /api/users/public/:username         | Retrieves a users public info  | srtybu           |
| GET         | /api/users/private/:id              | Retrieves a users private info | srtybu           |
| PUT         | /api/users/bio/:id                  | Updates bio                    | srtybu           |
| POST        | /api/users/unboard/:id              | Deletes a user                 | srtybu           |
| POST        | /api/users/profile-image/:id        | Adds user's profile image      | srtybu           |
| GET         | /api/users/profile-images/:filepath | Gets user's profile image      | srtybu           |
| DELETE      | /api/users/profile-image/:id        | Deletes a user's profile image | srtybu           |
| GET         | /api/users/posts/:id/:chunk         | Gets user's posts              | srtybu           |
| POST        | /api/subscribe/:id/:creator_id      | Adds/Removes a subscriber      | srtybu           |

#### GET `/api/users/public/:username`

Requires user cookie

Response:

```json
{
  "id": 14,
  "full_name": "Jane Doe",
  "username": "Jane",
  "bio": null,
  "profile_image": null,
  "created_at": "2019-09-25 03:45:38"
}
```

#### GET `/api/users/private/:id`

Requires user cookie that owns resource

```json
{
  "id": 13,
  "email": "johndoe@gmail.com",
  "full_name": "John Doe",
  "username": "john",
  "bio": null,
  "profile_image": null,
  "created_at": "2019-09-25 07:20:29"
}
```

---

#### PUT `/api/users/bio`

Requires user cookie that owns resource

Send in request body:

```json
{
  "bio": "New bio!"
}
```

Response:

```json
{
  "id": 14,
  "email": "examples@gmail.com",
  "full_name": "John",
  "username": "basdfrian",
  "bio": "New bio!",
  "profile_image": null,
  "created_at": "2019-09-25 07:20:29"
}
```

---

#### POST `/api/users/unboard/:id`

```json
{
  "password": "asdfa"
}
```

Requires user cookie that owns resource
Response:

204 no content

---

#### POST `/api/users/profile-image/:id`

Requires user cookie that owns resource

Send image in form-data with key profile-image

```json
{
  "id": 13,
  "email": "example@gmail.com",
  "full_name": "Brian Illes",
  "username": "brian",
  "bio": null,
  "profile_image": "filepath",
  "created_at": "2019-09-25 03:45:38"
}
```

#### GET `/api/users/profile-image/:filepath`

returns image

#### DELETE `/api/users/profile-image/:id`

Requires user cookie that owns resource
Response:

204 no content

---

#### POST `/api/users/subscribe/:id/:creator_id`

Requires user cookie that owns resource

200 or 204
