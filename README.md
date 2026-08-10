# ZeCoat Website Maintenance Guide

Welcome to the ZeCoat website project.

This guide is meant to help anyone who needs to update, maintain, or make changes to the website in the future.

The website does have both a frontend and a database connected to it, so some changes require more technical knowledge. This guide explains where things are located, how to make basic updates, and what to avoid.

---

# What This Website Uses

The ZeCoat website is built using several different technologies:

- **Astro** - The main framework used to create the website pages.
- **React** - Used for interactive features such as forms, calculators, and configurators.
- **Netlify** - Hosts the website and automatically publishes updates.
- **PostgreSQL Database** - Stores information submitted through the website.
- **GitHub** - Stores the website code and tracks changes.

You do not need to understand every technology listed above to make normal website updates. Most changes involve editing text, replacing images, or adding new content.

---

# Required Software

Before editing the website, install the following programs.

## Node.js

Node.js allows the website tools to run.

Download:

https://nodejs.org/

Install the recommended **LTS version**.

To verify installation:

```
node -v
```

You should see a version number.

Example:

```
v22.12.0
```

---

## Git

Git keeps track of website changes and connects the website to GitHub.

Download:

https://git-scm.com/downloads

Check installation:

```
git --version
```

---

## Visual Studio Code

Visual Studio Code is the recommended program for editing the website.

Download:

https://code.visualstudio.com/

This is where most website changes should be made.

---

# Downloading the Website

The website code is stored on GitHub.

Clone the repository:

```
git clone https://github.com/adrianquijada/zecoat-website.git
```

Enter the project folder:

```
cd <THE NAME OF YOUR FOLDER>
```

Install the required packages:

```
npm install
```

This downloads everything required for the website to run.

---

# Running the Website Locally

Before making changes, it is recommended to run the website on your computer first.

Start the development server:

```
npm run dev
```

You should see something like:

```
Local: http://localhost:4321/
```

Open that address in your browser.

You are now viewing a local version of the website.

Changes made locally will not affect the live website until they are uploaded.

To stop the website:

Press:

```
CTRL + C
```

---

# Website File Structure

Most website files are located inside:

```
src/
```

The important folders are:

```
src/

├── pages/
│      Website pages

├── components/
│      Reusable website sections

├── layouts/
│      Overall page structure

└── data/
       Website information
```

Images are stored in:

```
public/
```

Database files are stored in:

```
netlify/database/
```

---

# Editing Website Text

Most normal website updates involve changing text.

Website pages are located in:

```
src/pages/
```

Examples:

```
src/pages/index.astro
```

Homepage.

```
src/pages/about.astro
```

About page.

```
src/pages/contact.astro
```

Contact page.

Inside these files you will see website text.

Example:

```html
<h1>
About ZeCoat
</h1>
```

Changing it to:

```html
<h1>
About ZeCoat Corporation
</h1>
```

will update the website.

After saving:

1. Refresh your browser
2. Confirm the change looks correct

---

# Adding or Changing Images

Images are stored in:

```
public/
```

Example:

```
public/

facility.jpg
mirror-coating.png
telescope.jpg
```

To add a new image:

1. Place the image inside the `public` folder
2. Reference it in the website code

Example:

```html
<img src="/facility.jpg">
```

Try to keep image names simple.

Recommended:

```
facility-building.jpg
```

Avoid:

```
Facility Building Final Image 2.jpg
```

Spaces and capital letters can cause problems.

---

# Updating Technologies and Capabilities

Technology and capability cards are stored in:

```
src/data/
```

Look for files containing:

```javascript
export const technologies = [
```

or:

```javascript
export const capabilities = [
```

Example:

```javascript
{
title: "FUV Aluminum",
description:
"Specialized aluminum coatings designed for ultraviolet astronomy."
}
```

To add a new item:

1. Copy an existing item
2. Change the title
3. Change the description
4. Add the correct image
5. Add the correct page link if needed

---

# Important Website Components

## Header

Location:

```
src/components/Header.astro
```

Controls:

- Navigation menu
- Logo
- Main website links

---

## Footer

Location:

```
src/components/Footer.astro
```

Controls:

- Contact information
- Footer links
- Copyright information

---

## Components Folder

Location:

```
src/components/
```

This contains reusable website sections.

Examples:

- Cards
- Buttons
- Forms
- Page sections

If something appears on multiple pages, it is probably stored here.

---

# Database Information

The website uses a PostgreSQL database.

The database currently stores:

- Announcements
- Contact submissions
- Quote requests

Database migration files are located here:

```
netlify/database/migrations
```

---

# Database Rules

Important:

**Do not edit old migration files.**

Once a migration has been applied, it is considered permanent.

If the database needs a change, create a new migration.

Examples of database changes:

- Adding a new table
- Adding a new field
- Changing stored information

---

# Announcements

Announcements are stored in the database.

The announcement table contains:

```
id
title
date
description
created_at
```

The website automatically retrieves announcements and displays them.

---

# API Routes

API routes connect the website to the database.

They are located here:

```
src/pages/api/
```

Examples:

```
src/pages/api/announcements
```

These files handle:

- Saving information
- Loading information
- Sending form submissions
- Connecting to the database

Do not modify API files unless you understand backend development.

A small mistake here can break forms or database connections.

---

# Updating the Live Website

When you are ready to publish changes:

## Step 1: Check changes

Run:

```
git status
```

This shows which files have changed.

---

## Step 2: Add changes

Run:

```
git add .
```

---

## Step 3: Save changes

Create a commit:

```
git commit -m "Describe your changes"
```

Example:

```
git commit -m "Updated technology descriptions"
```

---

## Step 4: Upload changes

Run:

```
git push
```

Netlify will automatically detect the changes and update the live website.

---

# Manual Deployment

Normally GitHub handles deployment automatically.

If manual deployment is needed:

Install Netlify CLI:

```
npm install -g netlify-cli
```

Deploy:

```
netlify deploy --prod
```

---

# Checking Database Status

To check the database:

```
netlify database status
```

A working database should show:

```
Applied migrations
```

If something is wrong, check:

- Database is enabled
- Migrations are applied
- Environment variables exist

---

# Common Problems

## Website Will Not Start

Try reinstalling packages:

```
npm install
```

Then:

```
npm run dev
```

---

## Changes Are Not Showing

Try:

1. Save the file
2. Refresh the browser
3. Restart the development server

---

## Database Errors

Run:

```
netlify database status
```

Check that migrations are applied.

---

## Deployment Failed

Common causes:

- Missing files
- Incorrect file names
- Code errors
- Missing packages

Check the Netlify deployment logs for the exact error.

---

# Recommended Workflow

Before making changes:

1. Make sure the website currently works
2. Make one change at a time
3. Test locally
4. Save changes with Git
5. Push changes to GitHub
6. Confirm Netlify deployed successfully

Avoid making many changes at once. It makes problems much harder to find.

---

# Project Information

Company:

ZeCoat Corporation

Repository:

https://github.com/adrianquijada/zecoat-website

Hosting:

Netlify

Database:

Netlify PostgreSQL Database

Framework:

Astro

---

# Final Notes

This website was built to be maintained without requiring a complete rebuild.

Most normal updates should include:

- Changing text
- Adding images
- Updating technology descriptions
- Adding announcements
- Updating company information

Changes involving:

- Database structure
- Authentication
- Backend systems
- Website architecture

should be handled by someone with web development experience.

Always test changes locally before publishing them to the live website.