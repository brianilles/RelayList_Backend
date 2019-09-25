# RelayList_Backend

## Endpoint table

Authentication and Authorization

| HTTP METHOD | Endpoint                         | Description                                      |
| ----------- | -------------------------------- | ------------------------------------------------ |
| POST        | /api/auth/register               | Adds an unverified user                          |
| GET         | /api/auth/send-verification/:id  | Sends verification email with token              |
| POST        | /api/auth/check-verification/:id | Confirms/denies token and registers user         |
| POST        | /api/auth/login                  | Logs in user and send back user object w/ cookie |
| DELETE      | /api/auth/logout                 | Logs out user                                    |

## Endpoint examples

#### POST `/api/auth/register`

Send in request body:

```json
{
  "email": "brianrilles@gmail.com",
  "full_name": "Brian Illes",
  "username": "brian",
  "password": "hello"
}
```

Response:

```json
{
  "id": 27,
  "email": "brianrilles@gmail.com",
  "full_name": "Brian Illes",
  "username": "brian",
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
  "username": "brian",
  "password": "hello"
}
```

Response:

User Cookie

```json
{
  "id": 13,
  "email": "brianrilles@gmail.com",
  "full_name": "Brian Illes",
  "username": "brian",
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
