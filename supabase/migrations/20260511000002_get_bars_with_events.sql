create or replace function get_bars_with_events()
returns json
language sql
as $$
  select json_agg(row_to_json(t)) from (
    select
      b.id, b.name, b.city, b.slug,
      ST_Y(b.location::geometry) as latitude,
      ST_X(b.location::geometry) as longitude,
      coalesce(
        json_agg(
          json_build_object(
            'id',         e.id,
            'title',      e.title,
            'starts_at',  e.starts_at,
            'sport_name', s.name,
            'sport_id',   e.sport_id
          ) order by e.starts_at
        ) filter (where e.id is not null and e.starts_at > now()),
        '[]'
      ) as events
    from bars b
    left join sports_events e on e.bar_id = b.id
    left join sports_catalog s on s.id = e.sport_id
    where b.location is not null
    group by b.id, b.name, b.city, b.slug, b.location
  ) t
$$;
