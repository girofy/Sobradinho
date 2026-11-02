-- Rode UMA vez no painel do Supabase: SQL Editor > New query > cole tudo > Run.
-- Faz o botão "Excluir conta" do app apagar a conta de verdade (exigência do Google Play e da LGPD).
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Não autenticado'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
