### Feeds

## Endpoints

| HTTP METHOD | Endpoint                   | Description            | Cookies Required |
| ----------- | -------------------------- | ---------------------- | ---------------- |
| GET         | /api/feeds/main/:id/:chunk | Gets generic post feed | srtybu           |

### Endpoint examples

#### GET `/api/feeds/main/:id/:chunk`

Response:

```json
[
  {
    "id": 12,
    "title": "Hello universe",
    "description": "asdfasf",
    "type": "news",
    "created_at": "2019-09-28 20:19:35",
    "hasLiked": false,
    "likes": 0,
    "creator": {
      "full_name": "Brian Illes",
      "username": "brian",
      "bio": null,
      "profile_image": null,
      "created_at": "2019-09-28 18:28:07"
    }
  },
  ...
]
```

---
