# ZeCoat Website Maintenance Guide

Welcome to the ZeCoat website project.

This document explains how to update, maintain, and deploy the ZeCoat website. The goal of this guide is to allow future employees, developers, or website managers to safely update the website without needing to understand every part of the code.

---

# Overview

The ZeCoat website is built using the following technologies:

- **Astro** - Website framework used to create the pages
- **React** - Used for the interactive website components, such as the contact page, order form, and calculators
- **Netlify** - Hosts the website and handles deployments
- **PostgreSQL Database** - Stores website information such as announcements, contact submissions, and quote requests
- **GitHub** - Stores the website code and tracks changes

---

# Required Software

Before editing the website, install the following programs.

## 1. Node.js

Node.js allows the website tools to run.

Download:

https://nodejs.org/

Install the recommended **LTS version**.

To verify installation:

Open Command Prompt or PowerShell and run:

```
node -v
```

You should see a version number.

Example:

```
v22.12.0
```

---

## 2. Git

Git tracks website changes and connects the computer to GitHub.

Download:

https://git-scm.com/downloads

Verify installation:

```
git --version
```

---

## 3. Visual Studio Code

Visual Studio Code is the recommended program for editing the website.

Download:

https://code.visualstudio.com/

---

# Downloading the Website

The website code is stored on GitHub.

Clone the repository:

```
git clone https://github.com/adrianquijada/zecoat-website.git
```

Enter the website folder:

```
cd zecoat-website
```

Install required packages:

```
npm install
```

This may take a few minutes.

---

# Running the Website Locally

Before making changes, test the website locally.

Start the development server:

```
npm run dev
```

You should see:

```
Local: http://localhost:4321/
```

Open that address in your browser.

The website is now running on your computer.

To stop the website:

Press:

```
CTRL + C
```

---

# Website File Structure

The main website files are located inside:

```
src/
```

Important folders:

```
src/
|
├── pages/
|      Website pages
|
├── components/
|      Reusable website sections
|
├── layouts/
|      Overall website structure
|
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

Most website text is stored inside `.astro` files.

Example:

```
src/pages/about.astro
```

You may see:

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
2. Check that the changes appear

---

# Adding or Changing Images

Images are stored in:

```
public/
```

Example:

```
public/
|
├── facility.jpg
├── telescope.png
└── coating-machine.jpg
```

To add an image:

1. Place the image inside the `public` folder
2. Reference it in the website

Example:

```html
<img src="/facility.jpg">
```

Important rules:

- Avoid spaces in filenames
- Use simple names
- File names are case-sensitive

Good:

```
facility-building.jpg
```

Bad:

```
Facility Building Final Image.jpg
```

---

# Updating Technologies and Capabilities

Technology and capability cards are usually stored in:

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
 "A specialized aluminum coating designed for ultraviolet astronomy."
}
```

To add a new item:

1. Copy an existing item
2. Change the title
3. Change the description
4. Add the correct image
5. Add the correct page link if needed

---

# Updating Website Pages

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

---

# Important Components

## Header

Location:

```
src/components/Header.astro
```

Controls:

- Navigation menu
- Logo
- Main website links


## Footer

Location:

```
src/components/Footer.astro
```

Controls:

- Footer links
- Contact information
- Copyright information


## Cards and Sections

Most reusable website sections are stored in:

```
src/components/
```

---

# Database Information

The website uses a PostgreSQL database.

The database stores:

- Announcements
- Contact form submissions
- Quote requests

Database migrations are located at:

```
netlify/database/migrations
```

---

# Database Rules

Important:

Do not edit old migration files.

Once a migration has been applied, it cannot be changed.

If a database change is needed:

Create a new migration instead.

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

The website automatically retrieves announcements from the database and displays them.

---

# API Routes

API routes handle communication between the website and database.

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
- Reading information
- Sending form submissions

Do not modify API files unless you understand backend code.

---

# Making Website Changes Live

After making changes:

## Step 1: Check changed files

Run:

```
git status
```

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

Netlify will automatically detect the changes and update the website.

---

# Manual Deployment

If needed, install Netlify CLI:

```
npm install -g netlify-cli
```

Deploy manually:

```
netlify deploy --prod
```

---

# Checking Database Status

To check the database:

```
netlify database status
```

A healthy database should show:

```
Applied migrations
```

---

# Common Problems

## Website will not start

Try reinstalling packages:

```
npm install
```

Then:

```
npm run dev
```

---

## Changes are not showing

Try:

1. Save the file
2. Refresh browser
3. Restart development server

---

## Database errors

Check:

```
netlify database status
```

Make sure:

- Database is enabled
- Migrations are applied
- Environment variables exist

---

## Deployment Failed

Common causes:

- Missing files
- Incorrect file names
- Code syntax errors
- Missing packages

Check the Netlify build logs for details.

---

# Development Best Practices

Before making major changes:

1. Create a backup
2. Commit working changes
3. Change one thing at a time
4. Test locally
5. Deploy only after confirming everything works

---

# Project Information

Website:

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

This website was designed to be easily maintained.

Normal updates should include:

- Changing text
- Adding images
- Updating technology descriptions
- Adding announcements
- Updating company information

Major changes involving:

- Database structure
- Authentication
- Backend systems
- Website architecture

should be handled by someone with web development experience.

Always test changes before publishing them to the live website.