# Heroku Deploy

![GitHub package.json version](https://img.shields.io/github/package-json/v/AkhileshNS/heroku-deploy.svg)
![GitHub issues](https://img.shields.io/github/issues/AkhileshNS/heroku-deploy.svg)
![GitHub](https://img.shields.io/github/license/AkhileshNS/heroku-deploy.svg)

This is a very simple GitHub action that allows you to deploy to Heroku. The action works by running the following commands in shell via NodeJS:-

```bash
# This will create and write to a file called .netrc
# Some useful Stackoverflow answers pointed out that heroku
# checks this file for the username and password during login
# So writing to it beforehand will allow us to bypass the annoying
# open browser to login part of the heroku login
cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF

heroku login

# The APPNAME needs to be passed via the Action
heroku git:remote --app APP_NAME
# if the above command fails, then the action will run
# >heroku create APP_NAME
# if a buildpack was specified in the action, then it will run
# >heroku create APP_NAME --buildpack BUILDPACK

git push heroku HEAD:refs/heads/master
```

In order to use the action in your workflow, just add in your _.github/workflows/YOURACTION.yml_

```yaml
name: Deploy

on:
	push:
		branches:
			- master

jobs:
	build:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v1
			- uses: akhileshns/heroku-deploy@master # This is the action
			  with:
			  	heroku_api_key: ${{secrets.HEROKU_API_KEY}}
			  	heroku_app_name: "YOUR APP's NAME (must be unique to heroku)"
			  	heroku_email: "YOUR EMAIL"
			  	buildpack: "SOME BUILDPACK [OPTIONAL]"
```

You can if you want pass the heroku_app_name, heroku_email and buildpack through github secrets as well if you want, just make sure that atleast your heroku_api_key is passed via GitHub Secrets.

**Note.** You can find the secrets tab in your project's settings

**Also Note.** Be careful with your appname, cuz the action either deploys to an existing app or creates a new one if it doesn't exist. So if you accidently change it after deploying it once already, the action won't fail, it'll just create a new dyno and if you are on a paid plan, heroku can be expensive. On that note, always check the logs of your actions to make sure everything is A-OK.

**Also Also Note.** Sorry this is the last I promise, if you're using the above exact workflow code, keep in mind that it deploys whenever you make a change to the master branch (Even README updates which have nothing to do with application code) and that might not be very efficient for you, have a look through the github actions docs to customize when the action should trigger. 

(I would recommend making a separate dev branch and setting up the action to trigger upon pull request to the master branch) 

# License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AkhileshNS/heroku-deploy/blob/master/LICENSE) file for details