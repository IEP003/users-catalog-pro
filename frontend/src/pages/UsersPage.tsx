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
  const userDetailQuery = openUserId ? useUser(openUserId) : undefined;

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

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Users Catalog Pro</h1>

      <div className="mb-4">
        <input
          defaultValue={search}
          placeholder="Search name, email, city, department"
          onKeyDown={e => {
            if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value);
          }}
        />
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