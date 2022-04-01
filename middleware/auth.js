const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const MailService = require(global.appDir + '/api/services/MailService.js');

const configAuth = config.get('auth');
const dbModels = appGlobals.dbModels;
const modelName = "users";

let updateUser = async function(profile, done) {
	try {
		let _serviceInst = MailService.getInst();
		let dbModel = await dbModels.getModelInstance(modelName);
		let user = await dbModel.findOne({ where: { email_id: profile.emails[0].value } });
		if(user) {
			return done(null, user);
		} else {
			let reqBody = {
				login_type: profile.provider,
				social_profile_id: profile.id,
				email_id: profile.emails[0].value,
				display_name: profile.displayName,
				first_name: profile.name.givenName,
    			last_name: profile.name.familyName,
			};
			user = await dbModel.create(reqBody);
			let subject = "Account created";
			let text = "";
			let html = `<span>Hi ${reqBody.first_name} <p>Welcome, Your Account Created Successfully</p></span>`
			_serviceInst.sendEmail(reqBody.email_id, subject, text, html);
			return done(null, user);
		}
	} catch (error) {
		return done(error, null);
	}
}

//serealize and deserealize function
passport.serializeUser(async (user, done)=> {
	let dbModel = await dbModels.getModelInstance(modelName);
	user = await dbModel.findOne({ where: { social_profile_id: user.social_profile_id } });
	if(user) {
		done(null, user);
	}
});

passport.deserializeUser(async (user, done)=> {
	let dbModel = await dbModels.getModelInstance(modelName);
	user = await dbModel.findOne({ where: { social_profile_id: user.social_profile_id } });
	if(user) {
		done(null, user);
	}
});

//facebook strategy
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientId,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
	profileFields: ['id', 'displayName', "gender", 'photos', 'email'],
	enableProof: true,
    proxy: true
  },
  function(accessToken, refreshToken, profile, done) { 
    process.nextTick(async ()=> {
		await updateUser(profile, done);
	});
  }
));

//verify facebook access_token
passport.use(new FacebookTokenStrategy({
    clientID: configAuth.facebookAuth.clientId,
    clientSecret: configAuth.facebookAuth.clientSecret,
    fbGraphVersion: 'v3.0'
  }, function(accessToken, refreshToken, profile, done) {
	  console.log("facebook profile: ", profile);
	  process.nextTick(async ()=> {
		await updateUser(profile, done);
	});
  }
));

//google strategy
passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientId,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(async ()=> {
		await updateUser(profile, done);
	});
  }
));

//verify google access_token
passport.use(new GoogleTokenStrategy({
    clientID: configAuth.googleAuth.clientId,
    clientSecret: configAuth.googleAuth.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
	console.log("google profile: ", profile);
    process.nextTick(async ()=> {
		await updateUser(profile, done);
	});
  }
));