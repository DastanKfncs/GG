# Office Dashboard - Deployment Guide

## Quick Deploy Options

### 1. GitHub Pages (Automatic via GitHub Actions)

**Requirements:**
- GitHub account
- Push code to a GitHub repository

**Steps:**
1. Create a new repository on GitHub (e.g., `office-dashboard`)
2. Clone it locally and copy project files into it
3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/office-dashboard.git
   git push -u origin main
   ```
4. Go to repository Settings → Pages
5. Under "Build and deployment", select:
   - Source: `Deploy from a branch`
   - Branch: `main` / `root`
6. Click Save. Your site will be live at `https://YOUR_USERNAME.github.io/office-dashboard/`

**Automatic updates:** Every time you push to `main`, GitHub Actions will automatically redeploy.

---

### 2. Netlify (Recommended for easy setup)

**Requirements:**
- Netlify account (free tier available)
- GitHub repository or Netlify drag-and-drop

**Option A: Connect GitHub Repository**
1. Go to https://app.netlify.com/
2. Click "New site from Git"
3. Select GitHub and authorize
4. Choose your `office-dashboard` repository
5. Keep default settings (uses `netlify.toml` automatically)
6. Click "Deploy site"

Your site will be live at a Netlify URL (e.g., `https://your-dashboard-xxx.netlify.app/`)

**Option B: Drag and Drop**
1. Go to https://app.netlify.com/drop
2. Drag the project folder into the drop zone
3. Your site is deployed instantly

**Custom domain:** In Netlify dashboard → Domain settings → add your custom domain

---

### 3. Manual Deployment to Traditional Hosting

**VPS / Shared Hosting (Apache, Nginx, etc.):**
1. Compress project files: `zip -r dashboard.zip .`
2. Upload via FTP/SFTP to your hosting provider
3. Extract and configure web server to serve from project root

Example Nginx config:
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/office-dashboard;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

### 4. Vercel (Alternative to Netlify)

1. Go to https://vercel.com/
2. Click "New Project"
3. Import GitHub repository
4. Deploy (uses `vercel.json` if present)
5. Your site is live at `https://your-project.vercel.app/`

---

## Environment Variables (if needed in future)

Some hosting platforms allow environment variables. Add to `.env` or platform settings:
- `REACT_APP_NEWS_API_KEY` (if using custom NewsAPI key)

Currently, the dashboard works with default free APIs, so this is optional.

---

## CI/CD Pipeline

The included `.github/workflows/deploy-ghpages.yml` automatically:
- Triggers on push to `main` branch
- Deploys to GitHub Pages
- Takes ~1-2 minutes

No additional setup needed—just push and your site updates!

---

## Testing Before Deploy

Always test locally first:
```bash
cd "c:\Users\dasta\OneDrive\Desktop\Test-67"
python -m http.server 8000
# Open http://localhost:8000 and verify all widgets load
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API calls fail after deploy | Check browser console (F12) for CORS issues. Most APIs used are public and should work. |
| Theme doesn't persist | Check localStorage is enabled in browser. |
| GitHub Pages shows 404 | Ensure branch is set to `main` and `/root` in Settings → Pages. |
| Netlify shows old version | Clear browser cache (Ctrl+Shift+Del) and hard refresh (Ctrl+F5). |

---

## Cost

- **GitHub Pages**: Free
- **Netlify**: Free tier (unlimited deployments, 300 build minutes/month)
- **Vercel**: Free tier (100GB bandwidth/month)
- **Traditional hosting**: ~$3-15/month depending on provider

All free options are sufficient for this dashboard.
