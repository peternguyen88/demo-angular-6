@set PROJECT_DIR=D:\Codes\Angular\gmat-angular-6
@set FIREBASE_DIR=D:\Codes\Angular\Deployment\firebase

@echo ON
rem ==============Delete  files===================
del /S /Q %FIREBASE_DIR%\public\*
rem ==============Copy to Deployment folders=========
robocopy "%PROJECT_DIR%\dist" %FIREBASE_DIR%\public /s /e
rem ==============Deploy Firebase====================
cd /d %FIREBASE_DIR%
call __deploy.bat