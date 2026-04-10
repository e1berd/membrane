create or replace function public.health_check()
returns jsonb
language sql
security definer
stable
as $$
    select jsonb_build_object(
        'status', 'ok',
        'timestamp', now()::text,
        'version', current_setting('server_version')
    );
$$;
