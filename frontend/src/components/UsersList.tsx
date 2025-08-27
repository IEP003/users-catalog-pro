import React from 'react';
import type { User } from '../types/user';
import { useToggleActive } from '../hooks/useUsers';
import { toast } from 'react-toastify';

type Props = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isError: boolean;
  onPageChange: (p: number) => void;
  onOpenUser: (id: string | number) => void;
};

export default function UsersList({ users, total, page, limit, isLoading, isError, onPageChange, onOpenUser }: Props) {
  const toggle = useToggleActive();

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
      <table className="w-full table-auto mb-4">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">City</th>
            <th className="text-left">Created</th>
            <th className="text-left">Active</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={String(u.id)} className="border-t">
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

      <div className="flex items-center justify-between">
        <div>Всего: {total}</div>
        <div>
          {page > 1 && <button onClick={() => onPageChange(page - 1)}>Prev</button>}
          <span className="mx-2">Page {page}</span>
          {page * limit < total && <button onClick={() => onPageChange(page + 1)}>Next</button>}
        </div>
      </div>
    </div>
  );
}
