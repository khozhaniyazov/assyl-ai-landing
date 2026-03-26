# Domain Setup Guide for assylai.kz

## Cost: ~10,000 ₸/year (~$20/year)
- Domain registration: 10,000 ₸
- Hosting (GitHub Pages): FREE
- SSL certificate: FREE
- CDN (Cloudflare): FREE

**Monthly cost: ~833 ₸ (~$1.67/month)**

---

## Setup Steps

### 1. Buy Domain (5-10 min)
Purchase `assylai.kz` from a KZ registrar:
- **ps.kz** (checked: ~10,000 ₸/year)
- hoster.kz
- nic.kz

### 2. Create Cloudflare Account (5 min)
1. Go to https://dash.cloudflare.com/sign-up
2. Sign up for FREE plan
3. Add site: `assylai.kz`
4. Cloudflare will provide 2 nameservers (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`)

### 3. Update Nameservers at Registrar (5 min)
1. Log into your registrar (ps.kz)
2. Find DNS/Nameserver settings for `assylai.kz`
3. Replace registrar nameservers with Cloudflare nameservers
4. Wait 1-24 hours for DNS propagation (usually ~1 hour)

### 4. Configure Cloudflare DNS (2 min)
In Cloudflare dashboard, add these DNS records:

```
Type: CNAME
Name: @
Target: khozhaniyazov.github.io
Proxy: ON (orange cloud)

Type: CNAME
Name: www
Target: khozhaniyazov.github.io
Proxy: ON (orange cloud)
```

### 5. Configure GitHub Pages (2 min)
1. Go to: https://github.com/khozhaniyazov/assylai/settings/pages
2. Under "Custom domain", enter: `assylai.kz`
3. Check "Enforce HTTPS" (wait a few minutes for SSL to provision)

### 6. Verify Setup
The `CNAME` file in this repo already contains `assylai.kz`, so GitHub Pages knows which domain to serve.

---

## Total Setup Time
~30 minutes + DNS propagation wait (1-24 hours)

## Result
✅ Site live at `assylai.kz` with free SSL, CDN, and 24/7 uptime
