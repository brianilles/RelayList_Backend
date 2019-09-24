# RelayList_Backend

## Endpoint table

| HTTP METHOD | Endpoint                         | Description                              |
| ----------- | -------------------------------- | ---------------------------------------- |
| POST        | /api/auth/register               | adds an unverified user                  |
| POST        | /api/auth/email-verification/:id | send verification email with token       |
| POST        | /api/auth/verify-email/:id       | Confirms/denies token and registers user |
| POST        | /api/auth/login                  | Logs in user and send back user object   |
