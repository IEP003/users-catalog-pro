import React from 'react';
import type { User } from '../types/user';
import { useToggleActive } from '../hooks/useUsers';
import { toast } from 'react-toastify';
import './UsersList.css';

type Props = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isError: boolean;
  onPageChange: (p: number) => void;
  onOpenUser: (id: string ) => void;
};

export default function UsersList({ users, total, page, limit, isLoading, isError, onPageChange, onOpenUser }: Props) {
  const toggle = useToggleActive();
  const totalPages = Math.ceil(total / limit);

  async function handleToggle(u: User) {
    try {
      await toggle.mutateAsync({
          id: u.id,
          active: !u.active
      });
      toast.success('Статус обновлён');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка при обновлении');
    }
  }

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки списка</div>;
  if (users.length === 0) return <div>Пользователей не найдено</div>;

  return (
    <div>
      <table className="user-table">
        <caption className="text-left mb-2">Список пользователей</caption>
        <thead>
          <tr>
            <th className="text-left" scope="col">Name</th>
            <th className="text-left" scope="col">Email</th>
            <th className="text-left" scope="col">City</th>
            <th className="text-left" scope="col">Created</th>
            <th className="text-left" scope="col">Active</th>
            <th className="text-left" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={String(u.id)} className="border-t user-list-card">
              <td><button onClick={() => onOpenUser(u.id)} className="underline text-left">{u.name}</button></td>
              <td>{u.email}</td>
              <td>{u.city}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
              <td>{u.active ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleToggle(u)} disabled={toggle.isPending}>Toggle Active</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <div>Всего: {total}</div>
        <div className="pagination-buttons">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
