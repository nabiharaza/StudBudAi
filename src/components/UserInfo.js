import React from 'react';

const UserInfo = ({ user, handleLogout }) => {
    return (
        <div className="user-info">
            <span>Welcome, {user}</span>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserInfo;