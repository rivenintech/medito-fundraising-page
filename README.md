# Medito Fundraising Page

This is the source code for the Medito Foundation's fundraising page. It's built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com/) for the UI components.

## Features worth mentioning

- It's really easy to modify the website's content (just by changing variables) and has great performance thanks to Astro. It got **100 points in performance on Lighthouse on mobile** - [PageSpeed Insights Results](https://pagespeed.web.dev/analysis/https-medito-fundraising-page-pages-dev/1sh90z9bv7?form_factor=mobile).
- Progress/donate section:
  - The progress bar with percentage, raised amount, and donations counter are animated.
  - Notifications with the amount of the donation and the donor's name are displayed after each donation *(mock data for now)*.
- Donation form modal after clicking the "Donate" button:
  - Supports all currencies supported by Stripe (135+)! But it's really easy to remove the ones you don't want to support.
  - Supports one-off and recurring donations (monthly/yearly).
  - Connected to Stripe's TEST API, so you can see that it works properly. [(https://stripe.com/docs/testing#testing-interactively)](https://stripe.com/docs/testing#testing-interactively)
  - Includes client-side validation and Stripe's server-side validation. If the user enters invalid data, a notification with a Stripe error message will be displayed.
- Contact form in FAQ section:
  - Currently only front-end, because I don't know how you want to handle the submissions. However, I think the best idea would be to send the submissions to your email inbox by using the [MailChannels API with Cloudflare Workers integration](https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/) (I've done this for my own website). It's free and secured with Cloudflare Captcha (Turnstile). You can see a quick demo of how it could work on my [Twitter/X](https://x.com/rivenintech/status/1716572548106694849) 😁
- Share buttons:
  - To make it easy for people to share the fundraising on social media.

## File Structure

- `/functions` - Cloudflare Worker functions (Stripe Checkout - handles creating the checkout session).
- `/src`:
  - `/components` - Individual components of the website.
  - `/pages/index.astro` - **Main page. Here you can easily modify the content of the website** - on top of the file, after imports, you'll variables you can change to modify the content of the website without touching the rest of the code.
- `tailwind.config.mjs` - Tailwind CSS configuration file (you can change the colors and the font here).
  - *Share buttons color is defined in its component file (`/src/components/ShareButtons.astro`).*

## How to deploy to Cloudflare Pages

1. Fork this repository
2. Go to `astro.config.mjs` and change the `site` to your own domain (to generate share buttons URLs correctly).
3. Create a new project on [Cloudflare Pages](https://pages.cloudflare.com/) > Create new application > Choose Pages > Connect to Git.
4. Choose your forked repository and choose "Astro" from the framework preset.
5. (Stripe Setup) - add new environment variables:
    - `STRIPE_API_KEY` (from Stripe Dashboard > Developers > API Keys > Secret Key)
    - `PRODUCT_ID` (from Stripe Dashboard > Product Catalog > Products > Copy ID (right upper corner, example: `prod_KJ2xg5B0wX25kL`))
6. Click "Save and Deploy" and wait for the deployment to finish.

## Future Ideas

Unfortunately, I found out about this project a bit late. But I'll continue working on it. Here are some improvements I have planned:

- Make "recent donations" animated.
- Connect the contact form with MailChannels API to send questions to your inbox.
- Add a database to store the donations, and finish the Stripe Webhook API integration to update the donation counter and recent donations.

I'm open to any feedback and suggestions! I hope you like it 😊

### Inspirations

- [polar.sh](https://polar.sh/meditohq/medito-app/issues/195)
- [gofundme](https://www.gofundme.com/f/the-gifted-event)
