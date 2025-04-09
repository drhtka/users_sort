const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../db.json'));
const middlewares = jsonServer.defaults();

// Настройка CORS для доступа с фронтенда
server.use(cors());

// Обязательно добавляем парсинг JSON тела запроса
server.use(jsonServer.bodyParser);

// Middleware для добавления полей createdAt и updatedAt
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = new Date().toISOString();
    req.body.updatedAt = new Date().toISOString();
  }
  
  if (req.method === 'PUT') {
    req.body.updatedAt = new Date().toISOString();
  }
  
  next();
});

// Логирование запросов
server.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body || '');
  next();
});

// Используем middleware и router без префикса
server.use(middlewares);
server.use(router);

// Обработка ошибок
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`JSON Server запущен на порту ${PORT}`);
}); 