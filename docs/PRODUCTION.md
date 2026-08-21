# Production deployment

The `legal.samsprojects.xyz` deployment uses `docker-compose.production.yml` rather than the upstream development Compose file.

- Client: `127.0.0.1:3220`
- API server: `127.0.0.1:3221`
- MongoDB: internal Docker network only
- Persistent data: `techmoniumsign-mongo-data` and `techmoniumsign-files-data`
- Secrets: `/opt/techmoniumsign/.env` with mode `0600`

The existing host Nginx terminates TLS. `/api/` is proxied to the API server with the prefix removed; all other requests go to the client.

The checked-in route is `deploy/nginx/legal.samsprojects.xyz.conf`. Validate any host change with `nginx -t` before reloading Nginx.

## Deploy

```bash
docker compose --env-file /opt/techmoniumsign/.env -f docker-compose.production.yml build
docker compose --env-file /opt/techmoniumsign/.env -f docker-compose.production.yml up -d
```

After deployment, verify all three containers report healthy and confirm both endpoints:

```bash
curl --fail https://legal.samsprojects.xyz/
curl --fail https://legal.samsprojects.xyz/api/app/health
```

## Roll back the domain

The prior Legal containers and data are intentionally retained. The host also keeps a dated copy of the prior route beside the active Nginx file. Restore the Nginx upstream to `http://127.0.0.1:3210`, run `nginx -t`, and reload Nginx.

## Back up

Back up both named volumes. A release is not considered recoverable until a MongoDB restore and an uploaded-file restore have both been tested.

Outbound email uses authenticated SMTP configured only in `/opt/techmoniumsign/.env`. The production sender domain must remain verified with the provider. Never commit the SMTP password or copy it into browser configuration.

## Global templates

The global starter library is seeded by the `20260821010000-add_global_template_library.cjs` migration. It is read-only and visible to every authenticated workspace; using a global template creates a normal tenant-owned document. See [GLOBAL_TEMPLATES.md](GLOBAL_TEMPLATES.md) for the catalog and regeneration workflow.
