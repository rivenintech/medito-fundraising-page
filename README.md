# Medito Fundraising Page

This is the source code for the Medito Foundation's fundraising page. It's built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com) and
[shadcn](https://ui.shadcn.com/) for the UI components.

## Features worth mentioning

- Donation form modal after clicking the "Donate" button:
  - Supports all currencies supported by Stripe (135+)! But it's really easy to remove the ones you don't want to support.
  - Supports one-off and recurring donations (monthly/yearly).
  - Connected to Stripe's TEST API, so you can see that it works properly.
- Contact form in FAQ section:
  - Currently only front-end, because I don't know how you want to handle the submissions. However, I would like to send the submission to the email inbox by using the [MailChannels API with Cloudflare Workers](https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/) (I've done this for my own website). It's free and secured with Cloudflare Captcha (Turnstile). You can see a quick demo on my [Twitter](https://x.com/rivenintech/status/1716572548106694849) 😁
- Share buttons:
  - To make it easy for people to share the fundraising on social media.
- Donation Notification:
  - Currently, I have set it up without a backend. This button will be removed, and replaced with a backend server on Cloudflare Worker connected to Stripe's Webhook API for automatic notifications.
- Responsive design.

## File Structure

- `/functions` - Cloudflare Worker functions (Stripe Checkout - handles creating the checkout session)
- `/src`:
  - `/components` - Individual components of the website
  - `/pages/index.astro` - Main page. Here you can easily modify the content of the website - on top of the file you can see a list of dictionaries with the content of each section.

## How to deploy to Cloudflare Pages

1. Fork this repository
2. Create a new project on [Cloudflare Pages](https://pages.cloudflare.com/) > Create new application > Choose Pages > Connect to Git.
3. Choose your forked repository and choose "Astro" from the framework preset.
4. (Stripe Setup) - add new environment variables:
    - `STRIPE_API_KEY` (from Stripe Dashboard > Developers > API Keys)
    - `PRODUCT_ID` (from Stripe Dashboard > Product Catalog > Products > Copy ID (right upper corner, example: `prod_KJ2xg5B0wX25kL`))
5. Click "Save and Deploy" and wait for the deployment to finish.

## Future Ideas

Unfortunately, I found out about this project a bit late. But I would love to continue working on it. It would probably take 1-2 days to finish everything I wanted to do, like:

- Make "recent donations" animated.
- Connect the contact form with MailChannels API to send questions to your inbox.
- Add a database to store the donations, and finish the Stripe Webhook API integration to update the donation counter and recent donations.

I'm open to any feedback and suggestions! I hope you like it 😊

### Inspirations

- [polar.sh](https://polar.sh/meditohq/medito-app/issues/195)
- [gofundme](https://www.gofundme.com/f/the-gifted-event)
