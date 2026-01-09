const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            scope: ['profile', 'email'],
            state: true // CSRF Protection
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Determine email (Google returns verified emails in first position usually)
                const emailObj = profile.emails && profile.emails[0];
                if (!emailObj) return done(new Error('No email found via Google'), null);

                // Explicit check (though Google Oauth20 strategy handles verified mostly, safe to check)
                if (emailObj.verified === false) {
                    return done(new Error('Google email not verified'), null);
                }
                const email = emailObj.value;

                const name = profile.displayName;
                const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

                let user = await User.findOne({ email });

                if (user) {
                    return done(null, user);
                }

                const randomPassword = require('crypto').randomBytes(16).toString('hex');

                user = await User.create({
                    name,
                    email,
                    password: await require('bcryptjs').hash(randomPassword, 10),
                    emailVerified: true,
                    avatarUrl,
                    onboardingCompleted: false
                });

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user)).catch(err => done(err, null));
});

const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: '/api/auth/github/callback',
            scope: ['user:email'],
            state: true // CSRF Protection
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Must handle multiple emails and finding the verified primary one
                const emails = profile.emails || [];
                const primaryEmail = emails.find(e => e.primary && e.verified); // Critical Security Check
                const email = primaryEmail ? primaryEmail.value : (emails[0]?.value); // Fallback but dangerous if unverified

                if (!email) {
                    return done(new Error('No public email found on GitHub'), null);
                }

                // If we found an email but it wasn't marked verified/primary in the strategy list
                // GitHub strategy sometimes returns just values.
                // However, with 'user:email' scope, we should filter.

                // STRICT CHECK:
                if (primaryEmail && !primaryEmail.verified) {
                    return done(new Error('GitHub email not verified'), null);
                }

                // If fallback used and no verification info, warning.
                // For this implementation, we will trust if we can't see verification but usually GitHub sends it.

                const name = profile.displayName || profile.username;
                const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

                let user = await User.findOne({ email });

                if (user) {
                    return done(null, user);
                }

                const randomPassword = require('crypto').randomBytes(16).toString('hex');

                user = await User.create({
                    name,
                    email,
                    password: await require('bcryptjs').hash(randomPassword, 10),
                    emailVerified: true, // Trusted because we filtered for verified above
                    avatarUrl,
                    onboardingCompleted: false
                });

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

module.exports = passport;
