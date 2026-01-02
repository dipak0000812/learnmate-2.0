const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const googleId = profile.id;
                const avatarUrl = profile.photos[0]?.value;

                // Check if user exists
                let user = await User.findOne({ email });

                if (user) {
                    // Link Google ID if not present (optional)
                    // For now, just return the user
                    return done(null, user);
                }

                // Create new user
                // Password is required by schema, use a random strong placeholder
                // that the user won't know (they must use OAuth or Reset Password flow)
                const randomPassword = require('crypto').randomBytes(16).toString('hex');

                user = await User.create({
                    name,
                    email,
                    password: randomPassword, // Will be hashed by pre-save hook? 
                    // Wait, pre-save hook for hashing usually handles this if we assign plainly. 
                    // However, we used explicit hashing in register controller.
                    // Let's assume we need to hash it here if we insert standardly, 
                    // BUT since we are bypassing controller, we should hash it or ensure model handles it.
                    // Let's check User model... it's a simple schema. 
                    // Safest to hash it manually here like in authController.
                    password: await require('bcryptjs').hash(randomPassword, 10),
                    emailVerified: true, // Google verified this email
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

// We don't need serialize/deserialize if we are using stateless JWTs 
// and handling the response manually in the callback controller.
// But Passport usually expects them initialized.
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
            scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                const name = profile.displayName || profile.username;
                const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

                if (!email) {
                    return done(new Error('GitHub account must have a public email'), null);
                }

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

module.exports = passport;
