# Notes

## Design
* I'm thinking just two main "pages" right now for the webapp itself: login/register and the backend
* Login page
    * Social sign-in
    * Very simple
    * Should not take much time at all
    * https://dribbble.com/shots/5485808-Rang-Login-UI this looks pretty dece
* Backend
    * Similar UI to FB messenger
    * __FOCUSED__ around CHAT!!
    * Examples/Inspiration:
        * https://dribbble.com/shots/4797890--Chat-Property-dashboard
    * I'm leaning towards going with a white design right now to have consistency with landing page and I think it'll be a bit easier. Love gradients but imo they take too much time???


## Okta Integration
* Should use both User/pass login and social login... and perhaps some more advanced integration w/ social media like FB messenger, etc.
* SMS verification as well for chatbot will score a bunch of points imo

## Okta features used
* Auth/login (obviously)
* External identity providers (IDP) through Okta - Facebook, Google

### Potential Okta integrations
* Webhooks - userdata creation on the back-end
* Custom sign-in page w/ custom domain (should do if you have the chance!)
* Multi-factor login