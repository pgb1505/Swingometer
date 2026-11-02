# Premier League Swingometer

A free website showing every Premier League club's 2026/27 results against the same fixtures in 2025/26, with a projected final table. It updates itself every evening. Nobody needs an account to view it.

Setup takes about 15 to 20 minutes, once.

## 1. Get a free football-data.org key

1. Go to https://www.football-data.org/client/register and sign up for the free plan.
2. They email you an API token (a long string of letters and numbers). Keep that email handy.

## 2. Create a free GitHub account and a repository

1. Sign up at https://github.com if you don't have an account.
2. Click the **+** in the top right, then **New repository**.
3. Name it `swingometer`, set it to **Public**, and click **Create repository**.

## 3. Upload the website files

1. On your new repository's page, click **uploading an existing file**.
2. Unzip the download on your computer and drag in everything inside the folder: `index.html`, `README.md`, and the `data`, `scripts` and `setup` folders.
3. Click **Commit changes**.

## 4. Add the daily update

GitHub needs this file in a special folder that's often hidden on computers, so it's easiest to create it on the website:

1. In your repository, click **Add file**, then **Create new file**.
2. In the file name box, type exactly: `.github/workflows/update.yml`
3. Open `setup/update.yml` from the download, copy everything in it, and paste it into the big box.
4. Click **Commit changes**.

## 5. Add your football-data.org key

1. In your repository, go to **Settings**, then **Secrets and variables**, then **Actions**.
2. Click **New repository secret**.
3. Name: `FOOTBALL_DATA_KEY`. Secret: paste your token from step 1.
4. Click **Add secret**.

The key stays private. It's never shown on the website.

## 6. Turn on the website

1. Go to **Settings**, then **Pages**.
2. Under **Branch**, choose `main` and `/ (root)`, then click **Save**.
3. After a minute or two, the page shows your address, something like `https://yourname.github.io/swingometer/`. That's the link to send your friends.

## 7. Test the update

1. Go to the **Actions** tab. If asked, click the button to enable workflows.
2. Click **Update results**, then **Run workflow**.
3. After about a minute it should show a green tick. Refresh your website: the "Results last checked" line at the bottom shows the new time.

That's it. From now on it runs every evening at 22:30 UK time (23:30 during British Summer Time) and adds any new results.

## Good to know

- **Update now:** Actions tab, **Update results**, **Run workflow**. Useful after a late game.
- **Share a club directly:** add the club to the end of the link, for example `.../swingometer/#manchester-united`.
- **If an update fails,** GitHub emails you. The most common causes are a mistyped secret, or the results service using a club name the script doesn't recognise; the run's log says which.
- **Summer break:** GitHub pauses scheduled jobs on repositories with no activity for 60 days. The daily check keeps it active during the season; if it's paused after the summer, go to the Actions tab and re-enable it.
- **Next season:** the files are set up for 2026/27. Ask Claude to roll it over for 2027/28 when the fixtures come out.
