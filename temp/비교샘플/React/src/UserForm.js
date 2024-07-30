import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSave, onUpdate, onClear }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    gender: '',
    tel: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        id: '',
        name: '',
        gender: '',
        tel: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, name, gender, tel } = formData;

    if (!name || !tel) {
      alert('이름과 연락처는 필수 입력 사항입니다.');
      return;
    }

    if (!validatePhoneNumber(tel)) {
      alert('올바른 연락처를 입력해주세요. 연락처는 10자리 또는 11자리 숫자여야 합니다.');
      return;
    }

    if (id) {
      onUpdate(formData);
    } else {
      onSave(formData);
    }
    handleClear();
  };

  const handleClear = () => {
    setFormData({
      id: '',
      name: '',
      gender: '',
      tel: ''
    });
    onClear();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={formData.id} />
      <div>
        이름 <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        남 <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} />
        여 <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
      </div>
      <div>
        연락처 <input type="text" name="tel" value={formData.tel} onChange={handleChange} />
      </div>
      <button type="submit">{formData.id ? '수정' : '등록'}</button>
      <button type="button" onClick={handleClear}>취소</button>
    </form>
  );
};

export default UserForm;