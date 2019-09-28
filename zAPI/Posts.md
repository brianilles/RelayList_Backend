### Posts

## Endpoints

| HTTP METHOD | Endpoint                         | Description                          | Cookies Required |
| ----------- | -------------------------------- | ------------------------------------ | ---------------- |
| GET         | /api/posts/post-preview/:post_id | Gets a post's preview                | srtybu           |
| GET         | /api/posts/:post_id              | Gets a post                          | srtybu           |
| POST        | /api/posts/:id                   | Adds a user's post                   | srtybu           |
| DELETE      | /api/posts/:id/:post_id          | Deletes user's post                  | srtybu           |
| POST        | /api/posts/like/:id/:post_id     | Adds/deletes a like on a user's post | srtybu           |

### Endpoint examples

#### POST `/api/post/:id`

Send in request body:

```json
{
  "id": 16,
  "user_id": 4,
  "title": "Hello universe",
  "description": "asdfasf",
  "type": "news",
  "content": [
    {
      "type": "p",
      "value": "hello this is a paragraph"
    },
    {
      "type": "h",
      "value": "hello this is a heading"
    },
    {
      "type": "p",
      "value": "hello this is a paragraph"
    },
    {
      "type": "h",
      "value": "hello this is a heading"
    }
  ],
  "created_at": "2019-09-28 20:29:18",
  "likes": 0
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
    "title": "Hello universe",
    "description": "asdfasf",
    "type": "news",
    "created_at": "2019-09-28 19:38:17",
    "likes": 0
  },
  "creator": {
    "full_name": "Brian Illes",
    "username": "brian",
    "bio": null,
    "profile_image": null,
    "created_at": "2019-09-28 18:28:07"
  }
}
```

---

#### GET `/api/posts/:post_id`

Response:

```json
{
  "post": {
    "title": "Hello universe",
    "description": "asdfasf",
    "type": "news",
    "created_at": "2019-09-28 19:38:17",
    "likes": 0,
    "content": [
      {
        "type": "p",
        "value": "hello this is a paragraph"
      },
      {
        "type": "h",
        "value": "hello this is a heading"
      },
      {
        "type": "p",
        "value": "hello this is a paragraph"
      },
      {
        "type": "h",
        "value": "hello this is a heading"
      }
    ]
  },
  "creator": {
    "full_name": "Brian Illes",
    "username": "brian",
    "bio": null,
    "profile_image": null,
    "created_at": "2019-09-28 18:28:07"
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
