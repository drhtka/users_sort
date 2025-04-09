require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Добавляем cors
const sequelize = require('./db/database');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:3000', // Разрешаем запросы только с фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешённые методы
  allowedHeaders: ['Content-Type'], // Разрешённые заголовки
}));

app.use(express.json());
app.use('/api/users', userRoutes);

sequelize.sync({ force: true }).then(() => {
  console.log('База данных синхронизирована');
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}).catch((err) => {
  console.error('Ошибка подключения к базе данных:', err);
  process.exit(1); // Явно завершаем процесс при ошибке
});

// Добавляем обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка в приложении:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});