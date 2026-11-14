# 06: Newsletter

**Goal:** Readers can subscribe safely; we collect the minimum data and respect consent.
**Depends on:** 04
**Status:** not started

## Scope

Signup form, double opt-in, unsubscribe, provider integration, abuse protection, privacy compliance.

## Out of scope

Composing and sending campaigns (done in the provider's tool for v1).

## Tasks

- [ ] Choose provider (Buttondown, Resend Audiences, or Mailchimp). Record the decision
- [ ] Signup form (footer and article end) with language field (`en` or `hr`)
- [ ] Server action or route handler: validate, rate-limit, verify CAPTCHA, call provider
- [ ] Double opt-in: confirmation email in the subscriber's language
- [ ] One-click unsubscribe and preference link in every email
- [ ] Confirmation and error pages in both languages
- [ ] Privacy text and consent wording reviewed (GDPR: purpose, provider named, how to withdraw)
- [ ] Honeypot field plus Cloudflare Turnstile

## Acceptance criteria

- A fake or typo email is rejected with a clear message; a valid one gets a confirmation email.
- Subscription is not active until the link is clicked.
- Submitting the form 10 times in a minute from one IP is throttled.
- We store no subscriber emails in our own database.
- A subscriber can unsubscribe in one click without logging in.

## Security

- Bot and email-bombing defense: Turnstile, rate limit per IP and per email, no enumeration (same response whether or not the email exists).
- Provider API key is server-side only.
- Request body validated with a schema; unknown fields rejected.

## Tests

- Unit: validation and rate-limit logic.
- Integration: provider mocked; success, duplicate, provider failure, CAPTCHA failure.
- E2E: subscribe flow in both languages.

## Decisions

- Provider: pending.
