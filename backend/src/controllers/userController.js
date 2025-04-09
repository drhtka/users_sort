const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try {
    console.log('Запрос GET /api/users');
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Ошибка в getUsers:', error);
    res.status(500).json({ error: 'Ошибка при загрузке пользователей' });
  }
};

exports.createUser = async (req, res) => {
  try {
    console.log('Запрос POST /api/users, данные:', req.body);
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Ошибка в createUser:', error);
    res.status(400).json({ error: 'Ошибка при создании пользователя' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log('Запрос PUT /api/users/:id, id:', req.params.id, 'данные:', req.body);
    const { id } = req.params;
    const [updated] = await User.update(req.body, { where: { id } });
    if (updated) {
      const updatedUser = await User.findByPk(id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Ошибка в updateUser:', error);
    res.status(400).json({ error: 'Ошибка при обновлении пользователя' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log('Запрос DELETE /api/users/:id, id:', req.params.id);
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Ошибка в deleteUser:', error);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
};

module.exports = exports;