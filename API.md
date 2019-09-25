## Endpoints

### Authentication and Authorization

| HTTP METHOD | Endpoint                         | Description                                      |
| ----------- | -------------------------------- | ------------------------------------------------ |
| POST        | /api/auth/register               | Adds an unverified user                          |
| GET         | /api/auth/send-verification/:id  | Sends verification email with token              |
| POST        | /api/auth/check-verification/:id | Confirms/denies token and registers user         |
| POST        | /api/auth/login                  | Logs in user and send back user object w/ cookie |
| DELETE      | /api/auth/logout                 | Logs out user                                    |

### Users

| HTTP METHOD | Endpoint               | Description                    |
| ----------- | ---------------------- | ------------------------------ |
| GET         | /api/users/public/:id  | Retrieves a users public info  |
| GET         | /api/users/private/:id | Retrieves a users private info |

### Endpoint examples

#### POST `/api/auth/register`

Send in request body:

```json
{
  "email": "example@gmail.com",
  "full_name": "John Doe",
  "username": "john",
  "password": "hello"
}
```

Response:

```json
{
  "id": 27,
  "email": "example@gmail.com",
  "full_name": "John Doe",
  "username": "john",
  "created_at": "2019-09-25 02:16:05"
}
```

---

#### GET `/api/auth/send-verification/:id`

Response:

```json
{
  "message": "Email sent"
}
```

---

#### POST `/api/auth/check-verification/:id`

Response:

201

---

#### POST `/api/auth/login`

Send in request body:

```json
{
  "username": "john",
  "password": "hello"
}
```

Response:

User Cookie

```json
{
  "id": 13,
  "email": "example@gmail.com",
  "full_name": "John Doe",
  "username": "john",
  "bio": null,
  "profile_image": null,
  "created_at": "2019-09-25 03:45:38"
}
```

---

#### POST `/api/auth/logout`

Response:

204 no content

---

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

Requires user cookie that owns resource
