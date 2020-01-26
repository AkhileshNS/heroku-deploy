# Heroku Deploy

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

# The BRANCH can be passed via the Action. If not passed, it defaults to 'HEAD'
git push heroku BRANCH:master
# if the above command fails, then the action will run
# >git push heroku BRANCH:master --force
# This is to ensure that your app gets updated should you choose to update from a different branch that is behind your current one
# But this might not be convenient for you in which case, you can switch off the behaviour by setting dontuseforce to true
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
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v2.0.2 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          buildpack: "SOME BUILDPACK" #OPTIONAL
          branch: "YOUR_BRANCH" #OPTIONAL and DEFAULT - 'HEAD' (a.k.a your current branch)
          dontuseforce: false #OPTIONAL and DEFAULT - false
```

You can if you want pass the heroku_app_name, heroku_email and buildpack through github secrets as well if you want, just make sure that atleast your heroku_api_key is passed via GitHub Secrets.

# Important Notes

- Make sure you are using **v2**' of the **actions/checkout** action and do not add the **fetch-depth** flag which is available as an option to the actions/checkout@v2 action. (Note. This is because the action expects a shallow clone of the repo and older versions of the actions/checkout action makes complete clones instead. Additionally, keep in mind that the action will unshallow your repo's clone so that renders the fetch-depth option useless if you are using the v2 of the actions/checkout action)

- You can find the secrets tab in your project's settings

- Be careful with your appname, cuz the action either deploys to an existing app or creates a new one if it doesn't exist. So if you accidently change it after deploying it once already, the action won't fail, it'll just create a new dyno and if you are on a paid plan, heroku can be expensive. On that note, always check the logs of your actions to make sure everything is A-OK.

- If you're using the above exact workflow code, keep in mind that it deploys whenever you make a change to the master branch (Even README updates which have nothing to do with application code) and that might not be very efficient for you, have a look through the github actions docs to customize when the action should trigger.

  (I would recommend making a separate dev branch and setting up the action to trigger upon pull request to the master branch)

- By default, if you don't specify a branch in your action, it will default to the HEAD branch (or whichever branch the action is defined under). So you might be wondering what happens if you define the same action in a different branch under the same heroku app name (or which you try to deploy to the same appname from a different branch)? The answer is that the new branch overrides whatever your old branch was (even if the new branch is behind the old branch in terms of commits unless you set dontuseforce to true)

# License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AkhileshNS/heroku-deploy/blob/master/LICENSE) file for details
