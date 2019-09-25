### Users

## Endpoints

| HTTP METHOD | Endpoint               | Description                    |
| ----------- | ---------------------- | ------------------------------ |
| GET         | /api/users/public/:id  | Retrieves a users public info  |
| GET         | /api/users/private/:id | Retrieves a users private info |
| PUT         | /api/users/bio/:id     | Updates bio                    |
| DELETE      | /api/users/:id         | Deletes a user                 |

#### GET `/api/users/public/:id`

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

#### DELETE `/api/users/:id`

Requires user cookie that owns resource
Response:

204 no content

---
