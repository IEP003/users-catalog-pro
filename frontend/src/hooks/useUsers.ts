import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "../api/users";
import type { User } from "../types/user";

export type ListParams = { page: number; limit: number; search?: string; sort?: string };

export function fetchUsers({ page, limit, search, sort }: ListParams) {
  const params = new URLSearchParams();
  params.append('_page', String(page));
  params.append('_limit', String(limit));
  if (search) {
    params.append('q', search);
  }
  if (sort) {
    const [field, order] = sort.split(':');
    params.append('_sort', field);
    params.append('_order', order);
  }

  return api.get<User[]>(`/users?${params.toString()}`).then((res) => {
    const total = Number(res.headers['x-total-count'] || '0');
    return { items: res.data, total };
  });
}

export function useUsers({ page, limit, search, sort }: ListParams) {
  return useQuery({
    queryKey: ["users", { page, limit, search, sort }],
    queryFn: () => fetchUsers({ page, limit, search, sort }),
    placeholderData: keepPreviousData,     // ← правильно, чтобы при смене page/search/sort не мигал "Loading"
    staleTime: 5000,            // (дополнительно) кэш считаем "свежим" 5 секунд
  });
}

export function useUser(id?: string | number) {
  return useQuery({
    queryKey: ['user', String(id)],
    queryFn: () => api.get(`/users/${id}`).then(r => r.data as User),
    enabled: !!id,               // ← запрос выполнится только если id передан
    staleTime: 10000,            // (необязательно) 10 сек. считаем кэш свежим
  });
}

export function useToggleActive() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string | number; active: boolean }) =>
      api.patch(`/users/${id}`, { active }).then(r => r.data as User),
    onMutate: async ({ id, active }) => {
      const keyUser = ['user', String(id)];
      await qc.cancelQueries({ queryKey: keyUser });
      await qc.cancelQueries({ predicate: query => Array.isArray(query.queryKey) && query.queryKey[0] === 'users' });

      const previousUser = qc.getQueryData(keyUser);
      const previousLists = qc.getQueriesData({ predicate: query => Array.isArray(query.queryKey) && query.queryKey[0] === 'users' });

      // optimistic update user
      qc.setQueryData(keyUser, (old: any) => (old ? { ...old, active } : old));

      // optimistic update all lists
      previousLists.forEach(([queryKey, data]: any) => {
        if (!data || !data.items) return;
        qc.setQueryData(queryKey, (old: any) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.map((u: User) => (String(u.id) === String(id) ? { ...u, active } : u)),
          };
        });
      });

      return { previousUser, previousLists };
    },
    onError: (err, variables, context: any) => {
      const id = String(variables.id);
      // rollback single user
      qc.setQueryData(['user', id], context?.previousUser ?? qc.getQueryData(['user', id]));

      // rollback lists
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]: any) => {
          qc.setQueryData(queryKey, data);
        });
      }

      // ensure fresh fetch
      qc.invalidateQueries({ predicate: query => Array.isArray(query.queryKey) && (query.queryKey[0] === 'users' || query.queryKey[0] === 'user') });
    },
    onSettled: (_data, _err, variables) => {
      qc.invalidateQueries({ predicate: query => Array.isArray(query.queryKey) && (query.queryKey[0] === 'users' || query.queryKey[0] === 'user') });
    },
    retry: 1,
  });
}