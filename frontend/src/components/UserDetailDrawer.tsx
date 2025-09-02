import React from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { User } from '../types/user';
import './UserDetailDrawer.css'

type Props = {
  id: string;
  userQuery: UseQueryResult<User, unknown>;
  onClose: () => void;
};

export default function UserDetailDrawer({ id, userQuery, onClose }: Props) {
  const { data: user, isLoading, isError } = userQuery;

  return (
    <div className="user-detail-panel">
      <button onClick={onClose} className="user-detail-close">Close</button>
      <h2>User detail — {id}</h2>
      {isLoading && <div className="user-detail-loading">Loading...</div>}
      {isError && <div className="user-detail-error">Error loading user</div>}
      {user && (
        <div className="user-detail-content">
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
