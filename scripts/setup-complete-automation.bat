@echo off
REM Complete Automation Setup for Content Tsunami
REM Creates scheduled tasks for GENERATION + AUTO-COMMIT + AUTO-DEPLOY

echo.
echo ========================================
echo   CONTENT TSUNAMI - COMPLETE AUTOMATION
echo   100%% FREE with DeepSeek + Ollama
echo ========================================
echo.

set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..
set PYTHON_SCRIPT=%PROJECT_DIR%\backend\content_tsunami_deepseek.py
set GIT_SCRIPT=%PROJECT_DIR%\scripts\auto-git-push.bat

echo Setting up GENERATION tasks (6 AM, 12 PM, 6 PM)...
echo.

REM Task 1: 6 AM Generation
schtasks /create /tn "ContentTsunami-Morning" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 06:00 /f
echo [OK] Morning generation task (6 AM)

REM Task 2: 12 PM Generation
schtasks /create /tn "ContentTsunami-Noon" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 12:00 /f
echo [OK] Noon generation task (12 PM)

REM Task 3: 6 PM Generation
schtasks /create /tn "ContentTsunami-Evening" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 18:00 /f
echo [OK] Evening generation task (6 PM)

echo.
echo Setting up AUTO-COMMIT + DEPLOY tasks (30 min after generation)...
echo.

REM Auto-commit tasks (30 minutes after generation)
schtasks /create /tn "AutoCommit-Morning" /tr "\"%GIT_SCRIPT%\"" /sc daily /st 06:30 /f
echo [OK] Morning auto-commit task (6:30 AM)

schtasks /create /tn "AutoCommit-Noon" /tr "\"%GIT_SCRIPT%\"" /sc daily /st 12:30 /f
echo [OK] Noon auto-commit task (12:30 PM)

schtasks /create /tn "AutoCommit-Evening" /tr "\"%GIT_SCRIPT%\"" /sc daily /st 18:30 /f
echo [OK] Evening auto-commit task (6:30 PM)

echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo 6 TASKS CREATED:
echo.
echo GENERATION (3x/day):
echo   - ContentTsunami-Morning (6:00 AM)
echo   - ContentTsunami-Noon (12:00 PM)
echo   - ContentTsunami-Evening (6:00 PM)
echo.
echo AUTO-COMMIT + DEPLOY (3x/day):
echo   - AutoCommit-Morning (6:30 AM)
echo   - AutoCommit-Noon (12:30 PM)
echo   - AutoCommit-Evening (6:30 PM)
echo.
echo ========================================
echo   WHAT HAPPENS NOW:
echo ========================================
echo.
echo EVERY DAY AT 6 AM:
echo   1. DeepSeek generates 1 article (2000+ words)
echo   2. 30 min later: Auto-commit to GitHub
echo   3. Vercel deploys automatically
echo   4. Article is LIVE on your site!
echo.
echo EVERY DAY AT 12 PM:
echo   Same process - 2nd article
echo.
echo EVERY DAY AT 6 PM:
echo   Same process - 3rd article
echo.
echo RESULT: 3 articles/day - 90 articles/month - 0 euro cost!
echo.
echo ========================================
echo   MANAGEMENT COMMANDS:
echo ========================================
echo.
echo To verify tasks:
echo   schtasks /query /fo LIST ^| findstr ContentTsunami
echo   schtasks /query /fo LIST ^| findstr AutoCommit
echo.
echo To disable all tasks:
echo   schtasks /delete /tn "ContentTsunami-Morning" /f
echo   schtasks /delete /tn "ContentTsunami-Noon" /f
echo   schtasks /delete /tn "ContentTsunami-Evening" /f
echo   schtasks /delete /tn "AutoCommit-Morning" /f
echo   schtasks /delete /tn "AutoCommit-Noon" /f
echo   schtasks /delete /tn "AutoCommit-Evening" /f
echo.
echo To test manually:
echo   python backend\content_tsunami_deepseek.py
echo   scripts\auto-git-push.bat
echo.
echo ========================================
echo   100%% AUTONOMOUS REVENUE GENERATION
echo ========================================
echo.
pause
