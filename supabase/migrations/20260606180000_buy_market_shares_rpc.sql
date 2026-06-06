-- Atomic fake-money buy: deduct balance, upsert position, append ledger entry.

create or replace function public.buy_market_shares(
  p_market_id uuid,
  p_side text,
  p_amount_cents bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_market public.markets%rowtype;
  v_balance_cents bigint;
  v_yes_shares_cents bigint;
  v_no_shares_cents bigint;
  v_side_label text;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  if p_side not in ('yes', 'no') then
    raise exception 'invalid side';
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'invalid amount';
  end if;

  select *
  into v_market
  from public.markets
  where id = p_market_id;

  if not found then
    raise exception 'market not found';
  end if;

  if v_market.status <> 'open' then
    raise exception 'market not buyable';
  end if;

  if v_market.close_date is not null and v_market.close_date <= now() then
    raise exception 'market not buyable';
  end if;

  select balance_cents
  into v_balance_cents
  from public.profiles
  where id = v_user_id
  for update;

  if not found then
    raise exception 'profile not found';
  end if;

  if v_balance_cents < p_amount_cents then
    raise exception 'insufficient balance';
  end if;

  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user_id;

  if p_side = 'yes' then
    insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
    values (v_user_id, p_market_id, p_amount_cents, 0)
    on conflict (user_id, market_id) do update
    set yes_shares_cents = public.positions.yes_shares_cents + excluded.yes_shares_cents;
  else
    insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
    values (v_user_id, p_market_id, 0, p_amount_cents)
    on conflict (user_id, market_id) do update
    set no_shares_cents = public.positions.no_shares_cents + excluded.no_shares_cents;
  end if;

  select yes_shares_cents, no_shares_cents
  into v_yes_shares_cents, v_no_shares_cents
  from public.positions
  where user_id = v_user_id
    and market_id = p_market_id;

  v_side_label := case when p_side = 'yes' then 'Yes' else 'No' end;

  insert into public.ledger_entries (
    user_id,
    market_id,
    amount_cents,
    entry_type,
    description
  )
  values (
    v_user_id,
    p_market_id,
    -p_amount_cents,
    'buy',
    format('Bought %s fake shares on %s side', p_amount_cents, v_side_label)
  );

  return jsonb_build_object(
    'ok', true,
    'balance_cents', v_balance_cents - p_amount_cents,
    'yes_shares_cents', v_yes_shares_cents,
    'no_shares_cents', v_no_shares_cents
  );
end;
$$;

revoke all on function public.buy_market_shares(uuid, text, bigint) from public;
grant execute on function public.buy_market_shares(uuid, text, bigint) to authenticated;
