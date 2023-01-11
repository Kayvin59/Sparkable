# Links

## Get links

By default sorted randomly

**URL** : `/links`

**Method** : `GET`

**Auth required** : No

**Permissions required** : None

**Query params** :

- 'sort=-date' (sorted newest first)
- 'categories=categories1,categories2,...' (filter by categories)

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "links": [
        {
            "id": 1,
            "uuid": "f2c23145-e292-4149-a997-918566608b76",
            "title": "title1",
            "link": "https://www.butterfy.me/",
            "image": "https://uploads-ssl.webflow.com/5fe2721ea6fb441f47d88866/5fe2726881e6e52053a0217c_Butterfy_Logo-p-500.png",
            "date": "2022-12-15T11:33:55.110Z",
            "username": "admin"
        }
    ],
    "total": 10
}
```

### Error Response

**Code** : `500 OK`
