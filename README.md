# Heroku Deploy

![GitHub issues](https://img.shields.io/github/issues/AkhileshNS/heroku-deploy.svg)
![GitHub](https://img.shields.io/github/license/AkhileshNS/heroku-deploy.svg)
![Tests](https://github.com/AkhileshNS/heroku-deploy/workflows/Tests/badge.svg)

This is a very simple GitHub action that allows you to deploy to Heroku. The action works by running the following commands in shell via NodeJS:-

## Table of Contents

1. [Getting Started](#getting-started)
2. [Important Note](#important-note)
3. [Options](#options)
4. [Examples](#examples)
   - [Deploy with Docker](#deploy-with-docker)
   - [Deploy with custom Buildpacks](#deploy-with-custom-buildpacks)
   - [Deploy Subdirectory](#deploy-subdirectory)
   - [Deploy Custom Branch](#deploy-custom-branch)
5. [Health Check](#health-check)
   - [Advanced Usage](#advanced-usage)
   - [Adding Delay](#adding-delay)
   - [Rollback on healthcheck failure](#rollback-on-healthcheck-failure)
6. [Environment Variables](#environment-variables)
   - [ENV File](#env-file)
7. [Procfile Passing](#procfile-passing)
8. [Deploying to a team](#deploying-to-a-team)
9. [Just Login](#just-login)
10. [Important Notes](#important-notes)
11. [License](#license)

## Getting Started

To get started using the action, just make sure to have a [Procfile](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-a-procfile) or a [Dockerfile](https://docs.docker.com/engine/reference/builder/) in your project and then create a folder called **.github** and inside it, create another folder called **workflows**. Finally inside the workflows folder, create a file called **main.yml** with the following contents:

_.github/workflows/main.yml_

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
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
```

Now go to your Heroku account and go to Account Settings. Scroll to the bottom until you see API Key. Copy this key and go to your project's repository on GitHub.

In your Repo, go to Settings -> Secrets and click on "New Secret". Then enter HEROKU_API_KEY as the name and paste the copied API Key as the value.

You can now push your project to GitHub and it will be automatically deployed to Heroku henceforth.

You learn more about GitHub Secrets [here](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) and GitHub Actions [here](https://docs.github.com/en/actions)

## Important Note

**Please Note**: Git has recently announced that it is planning to switch the default branch's name from "**master**" to "**main**". For this reason, the Action also pushes to the "**main**" branch in the heroku origin by default and if your Heroku App is still using the "**master**" branch, then the Action will automatically switch your Heroku remote to use "**main**" as the default branch. There is **No Action Needed** from you, just keep in mind that this change is occurring as you continue to use the App and if you ever need to manually deploy the App, you can do so using the following command:

```bash
git push heroku YOUR_BRANCH:refs/heads/main
```

Also the `remote_branch` property no longer exists in the latest release of the Action. If you still have this as part of the `3.10.9` release. Please remove it as it may cause problems in your workflow

**Please Note**: While creating a new project on Heroku, **do not** enable the option for **Automatic Deployments** as this would result in an error when the GitHub Action is triggered.

## Options

The action comes with additional options that you can use to configure your project's behavior on Heroku. You can setup these options under the "with" object as presented above:

| Name                        | Required | Description                                                                                                                                                                                         | Example                                               |
| --------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| heroku_api_key              | true     | This will be used for authentication. You can find it in your heroku homepage account settings                                                                                                      | \*\*\*                                                |
| heroku_email                | true     | Email that you use with heroku                                                                                                                                                                      | nsakhilesh02@gmail.com                                |
| heroku_app_name             | true     | The appname to use for deploying/updating                                                                                                                                                           | demo-rest-api                                         |
| buildpack                   | false    | An optional buildpack to use when creating the heroku application                                                                                                                                   | https://github.com/heroku/heroku-buildpack-static.git |
| branch                      | false    | The branch that you would like to deploy to Heroku. Defaults to "HEAD"                                                                                                                              | master, dev, test                                     |
| dontautocreate              | false    | Set this to true if you don't want to automatically create the Heroku app                                                                                                                           | true or false                                         |
| dontuseforce                | false    | Set this to true if you don't want to use --force when switching branches                                                                                                                           | true or false                                         |
| usedocker                   | false    | Will deploy using Dockerfile in project root                                                                                                                                                        | true or false                                         |
| docker_heroku_process_type  | false    | Type of heroku process (web, worker, etc). This option only makes sense when usedocker enabled. Defaults to "web" (Thanks to [singleton11](https://github.com/singleton11) for adding this feature) | web, worker                                           |
| docker_build_args           | false    | A list of args to pass into the Docker build. This option only makes sense when usedocker enabled.                                                                                                  | NODE_ENV                                              |
| appdir                      | false    | Set if your app is located in a subdirectory                                                                                                                                                        | api, apis/python                                      |
| healthcheck                 | false    | A URL to which a healthcheck is performed (checks for 200 request)                                                                                                                                  | https://demo-rest-api.herokuapp.com                   |
| checkstring                 | false    | Value to check for when conducting healthcheck requests                                                                                                                                             | ok                                                    |
| delay                       | false    | Time (in seconds) to wait before performing healthcheck. Defaults to 0 seconds                                                                                                                      | 5                                                     |
| procfile                    | false    | Contents of the Procfile to save and deploy                                                                                                                                                         | web: npm start                                        |
| rollbackonhealthcheckfailed | false    | When set to true this will attempt to rollback to the previous release if the healthcheck fails                                                                                                     | true or false                                         |
| env_file                    | false    | path to an env file (with respect to appdir)                                                                                                                                                        | /.env                                                 |
| justlogin                   | false    | Set to true if you want the action to just login to Heroku and nothing else                                                                                                                         | true or false                                         |
| region                      | false    | The region in which you would like to deploy a server                                                                                                                                               | eu or dublin                                          |
| stack                       | false    | Set stack of your heroku app if you need to change. Default: heroku-20                                                                                                                              | container                                             |
| team                        | false    | If deploying to an organization, then specify the name of the team or organization here                                                                                                             | team-xyz                                              |

## Examples

### Deploy with Docker

Heroku now allows users to deploy docker containers. To use this feature, simply add a Dockerfile to your project and add a `CMD` command at the end of the Dockerfile. This is the command used by heroku to start the webserver inside the container. Finally make sure to set the `usedocker` flag to true before deploying.

_.github/workflows/main.yml_

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
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          usedocker: true
```

Keep in mind that if you deploy once using docker, the same heroku app is not compatible with a non-docker setup and similarly, you cannot deploy a dockerized setup to a non-docker heroku app.

If you need to pass in any ARGs for the Docker build, you may provide a list of arg names which automatically pull from the environment.

_.github/workflows/main.yml_

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
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          usedocker: true
          docker_build_args: |
            NODE_ENV
            SECRET_KEY
        env:
          NODE_ENV: production
          SECRET_KEY: ${{ secrets.MY_SECRET_KEY }}
```

Also, thanks to [Olav Sundfør](https://github.com/olaven) for adding the Docker feature and [Matt Stavola](https://github.com/mbStavola) for adding the ability to pass in build args.

### Deploy with custom Buildpacks

Taken from the official heroku website:

"Heroku Buildpacks are sets of open source scripts that are used for compiling apps on Heroku. They form the backbone of Heroku’s [polyglot platform](https://www.heroku.com/languages). Buildpacks enable you to extend Heroku's build system to support your language or customizations, or to make particular binary packages available to the runtime. Heroku Buildpacks give you the freedom to code in the languages and frameworks that work best for your app and your team"

To use a custom buildpack in the action, simply add the url of the buildpack to the action:

_.github/workflows/main.yml_

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
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          buildpack: "https://github.com/HashNuke/heroku-buildpack-elixir.git"
```

### Deploy Subdirectory

If you are using a complex application which has both frontend and backend applications in separate folders, you can specify a path to the directory to deploy using the **appdir** option:

_.github/workflows/main.yml_

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
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          appdir: "api" # <- This will point to the api folder in your project
```

Thanks to [meszarosdezso](https://github.com/meszarosdezso) for adding the appdir feature

### Deploy custom branch

You can use the **branch** option to deploy an app in another branch

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          branch: "dev"
```

Though this is also possible to do with GitHub Actions, click [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#on) for more information

### Deploy custom remote branch

You can use the **remote_branch** option to deploy an app to another remote branch

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          remote_branch: "main"
```

Though this is also possible to do with GitHub Actions, click [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#on) for more information

### Set stack for your app

In some cases, you need to change the default stack - heroku-20.
For example, If you are building docker images with heroku yml, you need to change the stack to container.
You can use the **stack** option to change stack for your app.

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          stack: "container"
```

Though this is also possible to do with GitHub Actions, click [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#on) for more information

## Health Check

Sometimes you will run into issues where the action has successfully deployed the project but because of some error in code or the like, the Heroku App crashes or fails to launch. To counter this, you can setup a healthcheck in the action:

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          healthcheck: "https://[YOUR APP's NAME].herokuapp.com/health"
```

Adding the url to the healthcheck option of the action will make the action attempt to perform a GET Request to that url and print the response if successful. Else it will fail the action to indicate that the deploy was not successful.

P.S: It is recommended that you setup a specific route such as **/health** for performing healthchecks

### Advanced Usage

Additionally, if you are using a custom route for performing healthchecks, you can check for a specific value from this url using the **checkstring** option of the action like so:

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          healthcheck: "https://[YOUR APP's NAME].herokuapp.com/health"
          checkstring: "ok"
```

This will essentially check if the value returned by sending a GET request to the **healthcheck** url is equal to the **checkstring**

### Adding Delay

In some cases, a healthcheck ends up being performed before the application has been setup on Heroku. To counter this, you can manually set the **delay** option in the action to make the action wait a certain period of time (in seconds) before performing the healthcheck

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          healthcheck: "https://[YOUR APP's NAME].herokuapp.com/health"
          checkstring: "ok"
          delay: 5
```

By default, the delay will be 0 if you choose to not set it

### Rollback on healthcheck failure

You can set the rollbackonhealthcheckfailed option to ensure that your application is rolled back if the healthcheck fails.
_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          healthcheck: "https://[YOUR APP's NAME].herokuapp.com/health"
          checkstring: "ok"
          rollbackonhealthcheckfailed: true
```

By default, the application will not be rolled back if the healthcheck fails.

Thanks to [FridaTveit](https://github.com/FridaTveit) for adding this feature

## Environment Variables

Heroku offers a means of passing sensitive information to your app (such as api keys etc) via something it calls **config vars** which you can find in the settings of your heroku app. But sometimes you might want to store sensitive information (api keys etc) in GitHub Secrets instead just to ensure platform independence. If you choose to this, you can then pass those secrets to your heroku app by using the "env" object of the action:-

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
        env:
          HD_FIREBASE_API_KEY: ${{secrets.FIREBASE_API_KEY}}
          HD_RANDOM_DATA: "Hello"
```

Note that the variables must start with "**HD\_**". This is is important so the action can tell your environment variable apart from multiple other variables (passed by your language, github actions etc) which you probably don't want sitting in your heroku app's config vars.

On that note, if you've set these variables and have deployed your app, you can check your Heroku App's config vars and you'll find that they have been set with the env variables you have passed.

**PLEASE NOTE**: The "**HD\_**" will be scrapped from the variable your name by the action. So in your project, "**FIREBASE_API_KEY**" will be passed instead of "**HD_FIREBASE_API_KEY**" (for example) and you can see this if you check your Heroku App's config vars. We understand that this can be confusing but this is again to ensure Platform independence and so that you don't have to use HD_FIREBASE_API_KEY if you choose to stop using Heroku

### ENV File

You can if you wish also pass the path to an env file (with respect to your appdir path) as an option to the action. The action will then read that file and set the config vars accordingly in Heroku

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          env_file: ".env"
        env:
          HD_FIREBASE_API_KEY: ${{secrets.FIREBASE_API_KEY}}
          HD_RANDOM_DATA: "Hello"
```

Example env file

```
HELLO=world
WORLD=hello
```

There are two important points to keep in mind when using the **env_file** option.

1. The first is that in can be used in conjunction with **env** option of the action as you have seen above

2. The second is that unlike in the **env** option, you do not need to prefix the env variables in the .env file with "HD\_".

   (For those of you who are wondering why this is the case, when using the **env** option, the env variables are passed directly into the process along with all the other env variables passed by GitHub Actions, the language you are using etc and the "HD\_" in that case is to help differentiate your env variables from them. But when using a file to pass the env variables, the action manually reads the file so there is no chance of stray env variables being passed by your language, github actions etc and hence no need to add the "HD\_")

Also note that using a file (which can be named anything so long as it follows the format of a standard env file) can be useful if you're trying to send a very large number of env variables to Heroku, it does mean that keeping the .env file secure and private is entirely in your hands so tread with caution.

## Procfile Passing

In some cases, you might want to be able to set the Procfile within the action itself instead of declaring it manually in your project. Although this approach is not recommended in favor of just using multiple branches, it might still be useful in some edge cases. You can set the Procfile in the action by using the **procfile** option of the action like so:

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME" #Must be unique in Heroku
          heroku_email: "YOUR EMAIL"
          procfile: "web: npm start"
```

Keep in mind this won't work if you are using Docker.

## Deploying to a team

If you are an enterprise user and wish to deploy your app to a specific team, you can do so by just passing the **team** option to the action:

_.github/workflows/main.yml_

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
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "YOUR APP's NAME"
          heroku_email: "YOUR EMAIL"
          team: "THE TEAM's NAME"
```

## Just Login

GitHub Actions does come with the heroku cli pre-installed (this is what is used by the Action to deploy applications). So if you wish to use the heroku cli and just need to login, you can use the **justlogin** option of the Heroku Deploy Action

_.github/workflows/main.yml_

```yaml
name: Deploy

on:
  push:
    branches:
      - master # Changing the branch here would also work

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12 # This is the action
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: ""
          heroku_email: "YOUR EMAIL"
          justlogin: true
      - run: heroku auth:whoami
```

## Important Notes

- You can check this repo's [_.github/workflows/main.yml_](https://github.com/AkhileshNS/heroku-deploy/blob/master/.github/workflows/main.yml) for example use cases of the action in use. Additionally the APIs for these use cases can be found in the [_tests_](https://github.com/AkhileshNS/heroku-deploy/tree/master/tests) folder of the repo

- You can find the secrets tab in your project's settings

- Be careful with your appname, cuz the action either deploys to an existing app or creates a new one if it doesn't exist. So if you accidently change it after deploying it once already, the action won't fail, it'll just create a new dyno and if you are on a paid plan, heroku can be expensive. On that note, always check the logs of your actions to make sure everything is A-OK.

- If you're using the above exact workflow code, keep in mind that it deploys whenever you make a change to the master branch (Even README updates which have nothing to do with application code) and that might not be very efficient for you, have a look through the github actions docs to customize when the action should trigger.

  (I would recommend making a separate dev branch and setting up the action to trigger upon pull request to the master branch)

- By default, if you don't specify a branch in your action, it will default to the HEAD branch (or whichever branch the action is defined under). So you might be wondering what happens if you define the same action in a different branch under the same heroku app name (or which you try to deploy to the same appname from a different branch)? The answer is that the new branch overrides whatever your old branch was (even if the new branch is behind the old branch in terms of commits unless you set dontuseforce to true)

- For more info on how Heroku enables deployment using Docker, check out [https://www.heroku.com/deploy-with-docker](https://www.heroku.com/deploy-with-docker)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AkhileshNS/heroku-deploy/blob/master/LICENSE) file for details
