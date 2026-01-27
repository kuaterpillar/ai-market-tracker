@echo off
REM Auto-commit and push generated articles to GitHub
REM This runs after each DeepSeek generation to deploy automatically

cd "c:\Users\kuate\Desktop\newprojetc argent ia"

echo.
echo ========================================
echo   AUTO-COMMIT GENERATED ARTICLES
echo ========================================
echo.

REM Add generated articles
echo Adding generated articles...
git add data/blog-posts.json src/app/blog/

REM Check if there are changes
git diff --staged --quiet
if %ERRORLEVEL% EQU 0 (
    echo No new articles to commit.
    goto :end
)

REM Commit with timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)

echo Committing articles...
git commit -m "🤖 DeepSeek: Auto-generated articles (%mydate% %mytime%)"

echo Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Articles deployed
    echo ========================================
    echo.
    echo Vercel will automatically redeploy the site.
    echo Your new articles will be live in ~2 minutes!
) else (
    echo.
    echo ========================================
    echo   ERROR: Push failed
    echo ========================================
    echo.
    echo Please check your internet connection.
)

:end
echo.
timeout /t 3
