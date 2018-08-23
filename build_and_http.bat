@echo ON
rem ==============Build Project======================
call build.bat
rem ==============Start Http Server==================
cd dist
http-server -p 4200