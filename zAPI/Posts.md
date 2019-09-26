### Posts

## Endpoints

| HTTP METHOD | Endpoint                         | Description                |
| ----------- | -------------------------------- | -------------------------- |
| POST        | /api/posts/:id                   | Adds a user's post         |
| GET         | /api/posts/post-preview/:post_id | Gets a post's preview      |
| GET         | /api/posts/:post_id              | Gets a post                |
| DELETE      | /api/posts/:id/:post_id          | Deletes user's post        |
| POST        | /api/posts/like/:id/:post_id     | Adds/deletes a user's post |

### Endpoint examples

#### POST `/api/post/:id`

Send in request body:

```json
{
  "title": "Hello world",
  "description": "a hello",
  "type": "Blog post",
  "content": [
    { "type": "p", "value": "hello this is a 👍" },
    { "type": "h3", "value": "hello this is an h3" }
  ]
}
```

Response:

```json
{
  "id": 11,
  "user_id": 1,
  "title": "Hello world",
  "description": "a hello",
  "type": "Blog post",
  "content": [
    {
      "type": "p",
      "value": "hello this is a 👍"
    },
    {
      "type": "h3",
      "value": "hello this is an h3"
    }
  ],
  "created_at": "2019-09-25 20:27:28"
}
```

---

#### GET `/api/posts/post-preview/:post_id`

Response:

```json
{
  "post": {
    "user_id": 1,
    "title": "Hello world",
    "description": "a hello",
    "type": "Blog post",
    "created_at": "2019-09-25 20:34:54"
  },
  "creator": {
    "full_name": "Brian Illes",
    "username": "brian",
    "bio": null,
    "profile_image": null,
    "created_at": "2019-09-25 19:38:43"
  }
}
```

---

#### GET `/api/posts/:post_id`

Response:

```json
{
  "post": {
    "id": 16,
    "user_id": 1,
    "title": "Hello world",
    "description": "a hello",
    "type": "Blog post",
    "content": [
      {
        "type": "p",
        "value": "hello this is a 👍"
      },
      {
        "type": "h3",
        "value": "hello this is an h3"
      }
    ],
    "created_at": "2019-09-25 20:40:47"
  },
  "creator": {
    "full_name": "Brian Illes",
    "username": "brian",
    "bio": null,
    "profile_image": null,
    "created_at": "2019-09-25 19:38:43"
  }
}
```

---

#### DELETE `/api/posts/:id/:postid`

Requires user cookie that owns resource
Response:

204 no content

---

#### POST `/api/posts/like/:id/:post_id`

Cooke auth

Response:
204 or 200
