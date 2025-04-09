const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../db.json'));
const middlewares = jsonServer.defaults();

// Настройка CORS для доступа с фронтенда
server.use(cors());

// Логирование запросов
server.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
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