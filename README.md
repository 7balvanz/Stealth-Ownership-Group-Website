# Stealth Ownership Group

Website and Cloudflare Worker. Production source is the main branch.

Deploy using Cloudflare Workers Git integration: build command empty, deploy command `npx wrangler deploy`.

Static assets live in public/. The Worker handles POST /api/inquiry and sends through a restricted CONTACT_EMAIL binding to the INQUIRY_TO runtime variable. Keep the destination mailbox out of this public repository. Verify the recipient in Cloudflare Email Routing before enabling the binding.

DNS and email routing are managed in Cloudflare. No credentials belong in this repository.
