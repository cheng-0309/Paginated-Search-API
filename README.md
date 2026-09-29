# Paginated Search API

A RESTful Express.js GET endpoint that searches a pre-loaded dataset of articles and returns the results in paginated chunks.

---

## 1. Project Structure

- [app.js](file:///Users/cheng/Desktop/Paginated-Search-API/app.js): Express application with the `GET /search` endpoint and validation / pagination logic.
- [db.json](file:///Users/cheng/Desktop/Paginated-Search-API/db.json): Pre-loaded articles dataset.
- [index.js](file:///Users/cheng/Desktop/Paginated-Search-API/index.js): Application entry point and server startup.
- [server.js](file:///Users/cheng/Desktop/Paginated-Search-API/server.js): Server exporter for test runner compatibility.
- [test/search.test.js](file:///Users/cheng/Desktop/Paginated-Search-API/test/search.test.js): Comprehensive unit & integration test suite using Jest and Supertest.

---

## 2. API Specification

### Endpoint
`GET /search`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | **Yes** | — | Search term to filter articles by their title (case-insensitive). Must not be empty or whitespace only. |
| `limit` | number | No | `5` | Maximum number of articles returned per page. |
| `page` | number | No | `1` | Page number of results to retrieve. |

---

## 3. Responses

### Successful Response (`200 OK`)
Returns JSON metadata along with the paginated `articles` array:
```json
{
  "currentPage": 1,
  "totalPages": 1,
  "totalResults": 2,
  "articles": [
    { "id": 101, "title": "Introduction to Programming Concepts", "author": "Coder One" },
    { "id": 102, "title": "Advanced Programming Techniques", "author": "Dev Expert" }
  ]
}
```

### Error Response (`400 Bad Request`)
Returned if `name` query parameter is missing, empty, or whitespace only:
```json
{
  "error": "Search name parameter is required."
}
```

---

## 4. Running the Project

### Install Dependencies
```bash
npm install
```

### Start Server
```bash
npm start
```
By default, the server runs on port `3000` (or `PORT` environment variable).

### Run Test Suite
```bash
npm test
```
