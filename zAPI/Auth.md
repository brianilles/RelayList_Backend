### Authentication and Authorization

## Endpoints

| HTTP METHOD | Endpoint                            | Description                                      | Cookies Required |
| ----------- | ----------------------------------- | ------------------------------------------------ | ---------------- |
| POST        | /api/auth/register                  | Adds an unverified user                          | NA               |
| GET         | /api/auth/send-verification/:id     | Sends verification email with token              | gKrTa            |
| POST        | /api/auth/check-verification/:id    | Confirms/denies token and registers user         | gKrTa            |
| POST        | /api/auth/login                     | Logs in user and send back user object w/ cookie | NA               |
| DELETE      | /api/auth/logout                    | Logs out user                                    | srtybu           |
| POST        | /api/auth/reset-password/start      | Starts reset password process                    | NA               |
| POST        | /api/auth/reset-password/send-reset | Send email to user's account                     | gKrTa            |
| POST        | /api/auth/reset-password/check      | Confirms/denies token and sets cookie user       | gKrTa            |
| POST        | /api/auth/reset-password/complete   | Completes password update and invalidates cookie | gKrTa            |

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

24 hour cookie identifying the client

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

Send in request body:

```json
{
  "token": "DSnNKwTqgNhv1DuPjXcqjg-GM0xlNv~jqqmhd~KWq4BkqNGJ3J5x_FzRG-UzBzKXz"
}
```

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

#### DELETE `/api/auth/logout`

Invalidates user cookie

Response:

204 no content

---

#### POST `/api/auth/reset-password/start`

Send in request body:

```json
{
  "email": "example@gmail.com"
}
```

Response:

```json
{
  "email": "example@gmail.com",
  "id": 6
}
```

---

#### POST `/api/auth/reset-password/send-reset`

Send in request body:

```json
{
  "email": "example@gmail.com"
}
```

Response:

```json
{
  "message": "Email sent"
}
```

---

#### POST `/api/auth/reset-password/check`

Send in request body:

```json
{
  "token": "EJymdQm~NDjhmwJORTJkPdtfa0u9LfHktzK_8FYcM7b.GdqJPO3nbCe9AFfIffYKn"
}
```

Response:

200

Cookie

---

#### POST `/api/auth/reset-password/complete`

Send in request body:

```json
{
  "password": "a;lsdjfasdfsdafa"
}
```

Response:
200
