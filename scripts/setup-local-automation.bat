@echo off
REM Setup Local Automation for Content Tsunami with DeepSeek
REM This creates Windows Task Scheduler jobs to run 3x per day

echo.
echo ========================================
echo   CONTENT TSUNAMI - LOCAL AUTOMATION
echo   100%% FREE with DeepSeek + Ollama
echo ========================================
echo.

set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..
set PYTHON_SCRIPT=%PROJECT_DIR%\backend\content_tsunami_deepseek.py

echo Setting up 3 scheduled tasks (6 AM, 12 PM, 6 PM)...
echo.

REM Task 1: 6 AM
schtasks /create /tn "ContentTsunami-Morning" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 06:00 /f
echo [OK] Morning task created (6 AM)

REM Task 2: 12 PM
schtasks /create /tn "ContentTsunami-Noon" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 12:00 /f
echo [OK] Noon task created (12 PM)

REM Task 3: 6 PM
schtasks /create /tn "ContentTsunami-Evening" /tr "python \"%PYTHON_SCRIPT%\"" /sc daily /st 18:00 /f
echo [OK] Evening task created (6 PM)

echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo 3 tasks created:
echo   - ContentTsunami-Morning (6 AM)
echo   - ContentTsunami-Noon (12 PM)
echo   - ContentTsunami-Evening (6 PM)
echo.
echo Your system will now generate 3 articles per day automatically!
echo 100%% FREE - No API costs!
echo.
echo To verify tasks:
echo   schtasks /query /tn "ContentTsunami-Morning"
echo.
echo To disable:
echo   schtasks /delete /tn "ContentTsunami-Morning" /f
echo   schtasks /delete /tn "ContentTsunami-Noon" /f
echo   schtasks /delete /tn "ContentTsunami-Evening" /f
echo.
pause
