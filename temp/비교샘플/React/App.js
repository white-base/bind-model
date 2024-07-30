import React, { useState } from 'react';
import UserForm from './UserForm';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSave = (user) => {
    setUsers([...users, { ...user, id: Date.now().toString() }]);
    alert('사용자가 성공적으로 등록되었습니다.');
  };

  const handleUpdate = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    alert('사용자 정보가 성공적으로 수정되었습니다.');
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
    setSelectedUser(null);
  };

  const handleEdit = (id) => {
    const user = users.find(user => user.id === id);
    setSelectedUser(user);
  };

  const handleClear = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <UserForm
        user={selectedUser}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onClear={handleClear}
      />
      <div>
        {users.map(user => (
          <div key={user.id}>
            <span>{user.name} ({user.gender}) - {user.tel}</span>
            <button onClick={() => handleEdit(user.id)}>수정</button>
            <button onClick={() => handleDelete(user.id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;