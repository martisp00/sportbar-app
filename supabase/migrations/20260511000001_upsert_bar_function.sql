create or replace function upsert_bar(
  p_owner_id uuid,
  p_name      text,
  p_slug      text,
  p_address   text,
  p_city      text,
  p_phone     text,
  p_description text,
  p_location_wkt text,
  p_id        uuid
)
returns void
language plpgsql
as $$
begin
  if p_id is not null then
    update bars set
      name        = p_name,
      slug        = p_slug,
      address     = p_address,
      city        = p_city,
      phone       = p_phone,
      description = p_description,
      location    = case
                      when p_location_wkt is not null
                      then ST_GeogFromText(p_location_wkt)
                      else null
                    end
    where id = p_id and owner_id = p_owner_id;
  else
    insert into bars (owner_id, name, slug, address, city, phone, description, location)
    values (
      p_owner_id,
      p_name,
      p_slug,
      p_address,
      p_city,
      p_phone,
      p_description,
      case
        when p_location_wkt is not null
        then ST_GeogFromText(p_location_wkt)
        else null
      end
    );
  end if;
end;
$$;
