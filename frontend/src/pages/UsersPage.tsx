import React from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useUsers, useUser } from '../hooks/useUsers';
import UsersList from '../components/UsersList';
import UserDetailDrawer from '../components/UserDetailDrawer';

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();

  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'createdAt:desc';

  const { data, isLoading, isError } = useUsers({ page, limit, search, sort });

  // open detail by route /users/:id (we have route mapping to this same component)
  const openUserId = params.id; // will be defined when route is /users/:id
  const userDetailQuery = useUser(openUserId);

  function goToPage(p: number) {
    searchParams.set('page', String(p));
    setSearchParams(searchParams);
  }

  function onSearch(q: string) {
    if (q) searchParams.set('search', q);
    else searchParams.delete('search');
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  }

  function onLimitChange(newLimit: number) {
    searchParams.set('limit', String(newLimit));
    searchParams.set('page', '1'); 
    setSearchParams(searchParams);
  }

  function onToggleSort() {
    const [field, dir] = sort.split(':');
    const newDir = dir === 'asc' ? 'desc' : 'asc';
    searchParams.set('sort', `${field}:${newDir}`);
    setSearchParams(searchParams);
  }


  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Users Catalog Pro</h1>
      <div className="flex items-center gap-4 mb-4">
        <input
          defaultValue={search}
          placeholder="Search name, email, city, department"
          onKeyDown={e => {
            if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value);
          }}
          className="border rounded px-2 py-1"
        />
        <select
          value={limit}
          onChange={e => onLimitChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
        </select>
        <button
          onClick={onToggleSort}
          className="border rounded px-2 py-1"
        >
          Sort by CreatedAt ({sort.endsWith('asc') ? 'ASC' : 'DESC'})
        </button>
      </div>      
      <UsersList
        users={data?.items ?? []}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        isLoading={isLoading}
        isError={isError}
        onPageChange={goToPage}
        onOpenUser={id => navigate(`/users/${id}`)}
      />

      {openUserId && userDetailQuery && (
        <UserDetailDrawer
          id={openUserId}
          userQuery={userDetailQuery}
          onClose={() => navigate('/')}
        />
      )}
    </div>
  );
}