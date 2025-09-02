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

  
  const openUserId = params.id ?? null; 
  const userDetailQuery = useUser(openUserId, { 
    enabled: !!openUserId
   });

   const [searchInput, setSearchInput] = React.useState(search);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams(prev => {
        console.log('Updating search param to:', searchInput);
        const sp = new URLSearchParams(prev);
        if (searchInput) sp.set('search', searchInput);
        else sp.delete('search');
        sp.set('page', '1');
        return sp;
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  function goToPage(p: number) {
    setSearchParams(prev => {
      const sp = new URLSearchParams(prev);
      sp.set('page', String(p));
      return sp;
    });
  }

  function onLimitChange(newLimit: number) {
    setSearchParams(prev => {
      const sp = new URLSearchParams(prev);
      sp.set('limit', String(newLimit));
      sp.set('page', '1'); 
      return sp;
    });
  }

  function onToggleSort() {
    setSearchParams(prev => {
      const sp = new URLSearchParams(prev);
      const current = sp.get('sort') ?? 'createdAt:desc';
      const [, dir = 'desc'] = current.split(':');
      const newDir = dir.toLowerCase() === 'asc' ? 'desc' : 'asc';
      sp.set('sort', `createdAt:${newDir}`);
      sp.set('page', '1');
      return sp;
    });
  }


  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Users Catalog Pro</h1>
      <div className="flex items-center gap-4 mb-4">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search name, email, city, department"
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