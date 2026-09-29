const request = require('supertest');
const app = require('../app');

describe('GET /search Endpoint Tests', () => {
  // Test 1: Example Scenario 1 - Search for "programming" with default limit (5) and page (1)
  test('Scenario 1: GET /search?name=programming (defaults limit=5, page=1)', async () => {
    const res = await request(app).get('/search?name=programming');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 2,
      articles: [
        { id: 101, title: 'Introduction to Programming Concepts', author: 'Coder One' },
        { id: 102, title: 'Advanced Programming Techniques', author: 'Dev Expert' }
      ]
    });
  });

  // Test 2: Example Scenario 2 - Search for "data" with limit=1, page=2
  test('Scenario 2: GET /search?name=data&limit=1&page=2 returns second page', async () => {
    const res = await request(app).get('/search?name=data&limit=1&page=2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      currentPage: 2,
      totalPages: 2,
      totalResults: 2,
      articles: [
        { id: 202, title: 'Big Data Analytics Explained', author: 'Analytics Pro' }
      ]
    });
  });

  // Test 3: Example Scenario 3 - Search for "webdev" with limit=2 (page defaults to 1)
  test('Scenario 3: GET /search?name=webdev&limit=2 returns matching article', async () => {
    const res = await request(app).get('/search?name=webdev&limit=2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalResults: 1,
      articles: [
        { id: 301, title: 'Responsive Web Development', author: 'Web Guru' }
      ]
    });
  });

  // Test 4: Example Scenario 4 - Nonexistent topic returns 0 results and totalPages: 0
  test('Scenario 4: GET /search?name=nonexistent_topic returns empty array with totalPages: 0', async () => {
    const res = await request(app).get('/search?name=nonexistent_topic');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
      articles: []
    });
  });

  // Test 5: Missing name parameter returns 400 Bad Request
  test('Error Scenario 1: GET /search without name parameter returns 400', async () => {
    const res = await request(app).get('/search');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Search name parameter is required.'
    });
  });

  // Test 6: Empty name parameter returns 400 Bad Request
  test('Error Scenario 2: GET /search?name= returns 400', async () => {
    const res = await request(app).get('/search?name=');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Search name parameter is required.'
    });
  });

  // Test 7: Whitespace name parameter returns 400 Bad Request
  test('Error Scenario 3: GET /search?name=%20%20 returns 400', async () => {
    const res = await request(app).get('/search?name=%20%20');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Search name parameter is required.'
    });
  });

  // Test 8: Case insensitivity - Searching with UPPERCASE term
  test('Case insensitivity: GET /search?name=PROGRAMMING matches regardless of case', async () => {
    const res = await request(app).get('/search?name=PROGRAMMING');
    expect(res.status).toBe(200);
    expect(res.body.totalResults).toBe(2);
    expect(res.body.articles.length).toBe(2);
    expect(res.body.articles[0].id).toBe(101);
    expect(res.body.articles[1].id).toBe(102);
  });

  // Test 9: Case insensitivity - Mixed case
  test('Case insensitivity: GET /search?name=dAtA matches regardless of case', async () => {
    const res = await request(app).get('/search?name=dAtA');
    expect(res.status).toBe(200);
    expect(res.body.totalResults).toBe(2);
  });

  // Test 10: Retain original article properties
  test('Article objects retain all original properties (e.g. id, title, author)', async () => {
    const res = await request(app).get('/search?name=promises');
    expect(res.status).toBe(200);
    expect(res.body.totalResults).toBe(1);
    expect(res.body.articles[0]).toHaveProperty('id');
    expect(res.body.articles[0]).toHaveProperty('title');
    expect(res.body.articles[0]).toHaveProperty('author');
    expect(res.body.articles[0].title).toBe('Understanding Promises');
  });

  // Test 11: Pagination page beyond totalPages returns empty articles array
  test('Pagination: Page out of bounds returns empty articles array', async () => {
    const res = await request(app).get('/search?name=data&limit=1&page=99');
    expect(res.status).toBe(200);
    expect(res.body.currentPage).toBe(99);
    expect(res.body.totalPages).toBe(2);
    expect(res.body.totalResults).toBe(2);
    expect(res.body.articles).toEqual([]);
  });

  // Test 12: Default limit and page applied when invalid limit/page provided
  test('Fallback to defaults when invalid or negative limit/page provided', async () => {
    const res = await request(app).get('/search?name=programming&limit=-5&page=invalid');
    expect(res.status).toBe(200);
    expect(res.body.currentPage).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.articles.length).toBe(2);
  });

  // Test 13: Response types - currentPage, totalPages, totalResults are numbers
  test('Metadata fields are strictly numbers', async () => {
    const res = await request(app).get('/search?name=data&limit=1&page=1');
    expect(res.status).toBe(200);
    expect(typeof res.body.currentPage).toBe('number');
    expect(typeof res.body.totalPages).toBe('number');
    expect(typeof res.body.totalResults).toBe('number');
    expect(Array.isArray(res.body.articles)).toBe(true);
  });

  // Test 14: Root endpoint check
  test('Root GET / returns health status and endpoints info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Paginated Search API is running');
  });
});
