const express = require('express');

// Pre-loaded dataset of articles from db.json
let allArticles = require('./db.json');

const app = express();

app.use(express.json());

// Helper method to set articles dynamically (useful for testing or external mocks)
app.setArticles = (articles) => {
  allArticles = articles;
};

// GET /search endpoint
app.get('/search', (req, res) => {
  const { name, limit: limitQuery, page: pageQuery } = req.query;

  // Validation: 'name' is required and must not be empty or whitespace only
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Search name parameter is required.'
    });
  }

  // Parse and set default for 'limit' (defaults to 5)
  let limit = 5;
  if (limitQuery !== undefined && limitQuery !== '') {
    const parsedLimit = parseInt(limitQuery, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = parsedLimit;
    }
  }

  // Parse and set default for 'page' (defaults to 1)
  let page = 1;
  if (pageQuery !== undefined && pageQuery !== '') {
    const parsedPage = parseInt(pageQuery, 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  // Ensure dataset is an array
  const dataset = Array.isArray(allArticles)
    ? allArticles
    : (allArticles && Array.isArray(allArticles.articles) ? allArticles.articles : []);

  // Filter articles case-insensitively by title or author
  const searchTerm = name.trim().toLowerCase();
  // Also build a compact version (no spaces/hyphens) to match abbreviations like "webdev" → "web development"
  const searchCompact = searchTerm.replace(/[\s\-_]+/g, '');
  const filteredArticles = dataset.filter((article) => {
    if (!article || !article.title) return false;
    const title = String(article.title).toLowerCase();
    const author = article.author ? String(article.author).toLowerCase() : '';
    const titleCompact = title.replace(/[\s\-_]+/g, '');
    // Match if title or author contains the search term, or compact title contains compact search
    return title.includes(searchTerm) || author.includes(searchTerm) || titleCompact.includes(searchCompact);
  });

  const totalResults = filteredArticles.length;
  const totalPages = totalResults === 0 ? 0 : Math.ceil(totalResults / limit);

  // Paginate filtered results
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  return res.status(200).json({
    currentPage: page,
    totalPages: totalPages,
    totalResults: totalResults,
    articles: paginatedArticles
  });
});

// Root endpoint for API health/info
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Paginated Search API is running',
    endpoint: 'GET /search?name=<term>&limit=<limit>&page=<page>'
  });
});

module.exports = app;
