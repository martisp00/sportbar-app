create or replace function get_bars_with_coordinates()
returns table (
  id uuid,
  name text,
  city text,
  slug text,
  latitude float,
  longitude float
)
language sql
as $$
  select
    id, name, city, slug,
    ST_Y(location::geometry) as latitude,
    ST_X(location::geometry) as longitude
  from bars
  where location is not null;
$$;
