# Setting Up Your Backend (Google Apps Script)

## What is this?
Google Apps Script (GAS) is a free tool provided by Google that allows you to run code in the cloud. For this project, it acts like a free server that lives in your Google account and connects your website to your Google Sheets database.

## Step by Step Guide

### 1. Open the Script Editor
Go to [script.google.com](https://script.google.com). You will see a dashboard with your existing projects. If you haven't used this before, it might be empty.

### 2. Create a New Project
Click the big **"New Project"** button in the top left corner of the screen. A new editor window will open with some default code that looks like `function myFunction() { ... }`.

### 3. Clear the Editor
Click inside the code editor, select everything (press **Ctrl+A** or **Cmd+A**), and delete it. The editor should be completely blank.

### 4. Copy the Backend Code
Open the folder where you downloaded this project on your computer. Find the file at:
`src/lib/gas/latest.ts`

Open that file with any text editor (like Notepad or TextEdit), select everything inside, and copy it (**Ctrl+C** or **Cmd+C**).

### 5. Paste and Save
Go back to your browser and paste the code into the blank Google Script editor (**Ctrl+V** or **Cmd+V**).
Click the **Floppy Disk icon** (Save) in the top toolbar. When prompted for a name, enter **"DNTRNG Backend"**.

### 6. Start the Deployment
Click the blue **"Deploy"** button at the top right of the screen.
Select **"New deployment"** from the dropdown menu.

### 7. Configure as a Web App
Click the **Gear icon** next to "Select type" and choose **"Web app"**.

Fill in the following details:
- **Description:** Enter "DNTRNG v1"
- **Execute as:** Select **"Me"** (your email)
- **Who has access:** Select **"Anyone"** (This is critical so your website can talk to the script)

### 8. Authorize Access
Click the blue **"Deploy"** button. A window will pop up asking for permission.
1. Click **"Authorize access"**.
2. Select your Google account.
3. You might see a screen saying "Google hasn't verified this app." Click **"Advanced"** at the bottom left, then click **"Go to DNTRNG Backend (unsafe)"**.
4. Click **"Allow"** on the final screen.

### 9. Get Your API URL
Once the deployment finishes, you will see a window with a **"Web App URL"**. It looks like this:
`https://script.google.com/macros/s/XXXX_XXXX/exec`

Click **"Copy"** and save this URL somewhere safe. This is your **API URL**—it is the bridge between your website and your data.

## Connecting to Your App

To make your website work, you need to tell it where to find this URL:

1. Go to your **Vercel Dashboard**.
2. Open your project settings and find **"Environment Variables"**.
3. Create a new variable:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** [Paste your Web App URL here]
4. Save and Redeploy your project.

## Common Problems

### "Authorization required"
If you see an error about permissions, it means you didn't finish Step 8. Go back to the script, click Deploy > Manage deployments, and ensure it is authorized.

### "Script not found" or "404"
Make sure you copied the entire URL correctly, including the `/exec` at the end. If you change your code in the script editor, you must click **Deploy > New Deployment** again to get a new version (or "Edit" the existing one).

### Quota Exceeded
Google allows a certain amount of traffic for free. If you have thousands of people taking tests at the same time, you might hit a daily limit. This is rare for normal school use.

---

**Need Help?**
If you get stuck or have questions, feel free to reach out to our team at support@yourdomain.com. We are here to help!