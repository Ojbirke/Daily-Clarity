# Daily Clarity — Support & Privacy hosting

Static pages for the App Store **Support URL** and **Privacy Policy URL**.
No backend, Node, or Express — just static HTML served by the existing shared
nginx reverse proxy on the Hetzner server.

**Live:**
- Privacy: https://dailyclarity.managemyapps.app/privacy.html
- Support: https://dailyclarity.managemyapps.app/support.html

## Files
- `privacy.html` — privacy policy
- `support.html` — support page
- `nginx-server-block.conf` — the server block added to the shared proxy (reference)

## How it's deployed (Hetzner, 65.21.1.29)

The server runs a shared Docker-based nginx reverse proxy that also serves
`managemyapps.app` and `teamup.managemyapps.app`. Config lives in
`~/devportal/docker/` on the server:
- `nginx-proxy.conf` → mounted into the `docker-nginx-1` container as `/etc/nginx/nginx.conf`
- `docker-compose.yml` → the proxy + certbot stack
- Let's Encrypt certs in the `docker_certbot_certs` volume

The Daily Clarity pages live in `~/devportal/docker/dailyclarity/` and are
bind-mounted into the container at `/var/www/dailyclarity`.

### Steps performed
1. **DNS:** A record `dailyclarity.managemyapps.app → 65.21.1.29` (Hetzner DNS).
2. **Files:** copied `privacy.html` + `support.html` to `~/devportal/docker/dailyclarity/`.
3. **Cert:** `cd ~/devportal/docker && docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d dailyclarity.managemyapps.app`
4. **Mount:** added `- ./dailyclarity:/var/www/dailyclarity:ro` to the `nginx` service in `docker-compose.yml`.
5. **Server block:** added the block from `nginx-server-block.conf` to `nginx-proxy.conf`.
6. **Validate + apply:** `docker exec docker-nginx-1 nginx -t` then `docker compose up -d nginx`.

Backups of both config files were saved on the server as
`nginx-proxy.conf.bak-dailyclarity-*` and `docker-compose.yml.bak-dailyclarity-*`.

### To update the page content later
    scp hosting/privacy.html hosting/support.html ole@65.21.1.29:~/devportal/docker/dailyclarity/
No reload needed — nginx serves the files directly from the bind mount.

### Cert renewal
The renewal config `dailyclarity.managemyapps.app.conf` sits alongside the other
two in the Let's Encrypt volume, so the server's existing
`docker compose run --rm certbot renew` job renews it automatically. nginx must
reload after a renewal to pick up the new cert.

## App Store Connect — update the URLs
Point the listing at the new host (away from the old Replit URL):
- **App Information → Support URL** → `https://dailyclarity.managemyapps.app/support.html`
- **App Privacy → Privacy Policy URL** → `https://dailyclarity.managemyapps.app/privacy.html`

Support URL can change anytime. The Privacy Policy URL is saved with the app
version, so set it before submitting the next build.
