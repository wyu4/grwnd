# GRWND
![image](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![image](https://img.shields.io/badge/GSAP-93CF2B?style=for-the-badge&logo=greensock&logoColor=white)
![image](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![image](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

![image](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![image](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

> [!NOTE]
> View the [live demo](https://grwnd.wyu.app/) here.

Grwnd is a platform targetted towards developers and tech enthusiates. Users are able to post about projects worth knowing about.

## Features

> [!NOTE]
> This project is more of a demo of the capabilities of databases, and lacks certain features like voting and commenting on other posts.

- ➕ Create posts
- 🖍️ Edit posts
- 🗑️ Delete posts

## Setup
This projects requires that you have NodeJS, a GitHub OAUTH App setup, and a Supabase project.

### Setting Up Supabase
In the project's SQL console, run the contents of the [schema dump file](database/schema.sql) to set up the project's layout.

### Environment Variables
Located inside of [.env.example](/.env.example) are the variables that should be filled. Of these variables, the following are mandatory:
```
GITHUB_OAUTH_ID=
GITHUB_OAUTH_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
BETTER_AUTH_SECRET= (random string)
BETTER_AUTH_URL=
DATABASE_CONNECTION_URL=#The Postgres connection URL to your database
```
The variables not included are either just for logging (the Discord webhooks) or extra control.

### Running The Code
This is a NextJS project, and can be automatically deployed onto the web with minial setup using [Vercel](https://vercel.com/). Here are the commands:
| Command     | Description |
|-------------|-------------|
| `npm install` | Install the dependencies (MUST)    |
| `npm run dev` | Run code    |
|`npm run build`| Build a production level version of the project (can be used to test)|
|`auth:migrate` | Generate minimum SQL schema for BetterAUTH (already done using the schema file) |
