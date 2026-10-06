const AppError = require('../utils/AppError');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const githubStrategy = require('passport-github2').Strategy;
const db = require('../utils/prisma');

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        // Generate a random 'state' and stash it in req.session, then verify it on
        // the callback. Without this the strategy installs a NullStore
        // (passport-oauth2/lib/strategy.js:113) and any 'state' is accepted blindly,
        // which enables login CSRF: an attacker can force a victim's browser to hit
        // your callback with the ATTACKER's code and silently get logged in as him.
        // Must be set HERE, at construction, not on authenticate() - passing a string
        // 'state' per-request is a constant, not a nonce (strategy.js:255-267).
        state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const emailVerified = profile.emails?.[0]?.verified;
                const imageUrl = profile.photos?.[0]?.value;
                // 1. google must provide an email
                if(!email) return done(null, false);    
                // 2. check emailVerifed => true or false
                if(!emailVerified) {
                    return done(
                        new AppError('Something went wrong with this google account, it might not be verifed, try another email', 401) , null
                    )
                }
                // 3. checking if this user already signed in with google before
                const existingGoogleAccount = await db.oAuthAccount.findUnique({
                    where : {
                        provider_providerAccountId : {
                            provider : 'GOOGLE',
                            providerAccountId : profile.id
                        }
                    },
                    include : {user : true}
                });
                if(existingGoogleAccount) {
                    await db.oAuthAccount.update({
                        where : {id:existingGoogleAccount.id},
                        data: {accessToken, refreshToken}
                    })
                    return done(null, existingGoogleAccount.user)
                }

                // 4. checking if local user has that email
                const existingUser = await db.user.findUnique({
                    where : {email}
                })
                if(existingUser) {
                    await db.oAuthAccount.create({
                        data : {
                            provider : 'GOOGLE',
                            providerAccountId: profile.id,
                            accessToken,
                            refreshToken,
                            userId : existingUser.id
                        }
                    })
                    return done(null, existingUser)
                }

                // 5. no existing user => fresh sign in 
                const user = await db.user.create({
                    data : {
                        name: profile.displayName,
                        email,
                        userName : await generateUniqueUsername(email),
                        imageUrl,
                        oauthAccounts : {
                            create : {
                                provider : 'GOOGLE',
                                providerAccountId: profile.id,
                                accessToken,
                                refreshToken
                            }
                        }

                    }
                });
                return done(null, user)
                // return done(null,profile);
            } catch (err) {
                return done(err, null)
            }
        }
    )
)
const sanitizeUsername = (email) =>
    email.split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 25);

const generateUniqueUsername = async (email) => {
    const base = sanitizeUsername(email) || 'user';
    let candidate = base;
    let suffix = 1;
    while (await db.user.findUnique({ where: { userName: candidate } })) {
        candidate = `${base}${suffix}`;
        suffix += 1;
    }
    return candidate;
};



passport.use(
    new githubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
        state: true},
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const imageUrl = profile.photos?.[0]?.value;
                const name = profile.displayName || profile.username;
                // 1. github must provide an email
                if(!email) return done(null, false);    
                
                // 3. checking if this user already signed in with github before
                const existingGithubAccount = await db.oAuthAccount.findUnique({
                    where : {
                        provider_providerAccountId : {
                            provider : 'GITHUB',
                            providerAccountId : profile.id
                        }
                    },
                    include : {user : true}
                });
                if(existingGithubAccount) {
                    await db.oAuthAccount.update({
                        where : {id:existingGithubAccount.id},
                        data: {accessToken, refreshToken}
                    })
                    return done(null, existingGithubAccount.user)
                }

                // 4. checking if local user has that email
                const existingUser = await db.user.findUnique({
                    where : {email}
                })
                if(existingUser) {
                    await db.oAuthAccount.create({
                        data : {
                            provider : 'GITHUB',
                            providerAccountId: profile.id,
                            accessToken,
                            refreshToken,
                            userId : existingUser.id
                        }
                    })
                    return done(null, existingUser)
                }

                // 5. no existing user => fresh sign in 
                const user = await db.user.create({
                    data : {
                        name,
                        email,
                        userName : await generateUniqueUsername(profile.username),
                        imageUrl,
                        oauthAccounts : {
                            create : {
                                provider : 'GITHUB',
                                providerAccountId: profile.id,
                                accessToken,
                                refreshToken
                            }
                        }

                    }
                });
                return done(null, user)
            } catch (error) {
                return done(error);
            }

                
        }
        
    )
)
            




module.exports = passport;