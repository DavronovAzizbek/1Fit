import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import "dotenv/config";

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_REDIRECT_URL as string,
    },
    (
      access_token: string,
      refresh_token: string | undefined,
      profile: any,
      done: any
    ) => {
      done(null, profile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
