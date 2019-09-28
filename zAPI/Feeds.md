### Feeds

## Endpoints

| HTTP METHOD | Endpoint               | Description            | Cookies Required |
| ----------- | ---------------------- | ---------------------- | ---------------- |
| GET         | /api/feeds/main/:chunk | Gets generic post feed | srtybu           |

### Endpoint examples

#### GET `/api/feeds/main`

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
