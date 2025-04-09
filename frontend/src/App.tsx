import React from 'react';
import { UserList } from './components/UserList';

const App: React.FC = () => {
  return (
    <div>
      <h1>Управление пользователями</h1>
      <UserList />
    </div>
  );
};

export default App;