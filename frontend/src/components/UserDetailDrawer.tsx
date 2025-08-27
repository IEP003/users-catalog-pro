import React from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { User } from '../types/user';

type Props = {
  id: string;
  userQuery: UseQueryResult<User, unknown>;
  onClose: () => void;
};

export default function UserDetailDrawer({ id, userQuery, onClose }: Props) {
  const { data: user, isLoading, isError } = userQuery;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, height: '100%', width: '420px',
      background: 'white', boxShadow: '-4px 0 12px rgba(0,0,0,0.1)', padding: '16px', zIndex: 50
    }}>
      <button onClick={onClose} style={{ float: 'right' }}>Close</button>
      <h2>User detail — {id}</h2>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading user</div>}
      {user && (
        <div>
          <p><strong>{user.name}</strong></p>
          <p>{user.email}</p>
          <p>City: {user.city}</p>
          <p>Dept: {user.department}</p>
          <p>Role: {user.role}</p>
          <p>Active: {user.active ? 'Yes' : 'No'}</p>
          <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
          <p>Phone: {user.phone}</p>
          <p>Bio: {user.bio}</p>
        </div>
      )}
    </div>
  );
}
