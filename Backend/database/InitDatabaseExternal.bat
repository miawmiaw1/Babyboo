@echo off
chcp 1252
echo Creating database 'TrumpBuyButik'...

REM Step 1: Create the database 'TrumpBuyButik' with owner 'postgres'
psql postgresql://postgres:EFhlhlwZqNzzSPuDmtEegbsHTHDZRyVQ@autorack.proxy.rlwy.net:15937 -c "SET CLIENT_ENCODING TO 'UTF8';" -c "CREATE DATABASE trumpbuybutik OWNER postgres;"

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to create database. Error level: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo Database 'TrumpBuyButik' created successfully.



REM Step 2: Connect to the database 'TrumpBuyButik' and execute the 'CreateTables.sql' script
echo Running CreateTables.sql script...
psql postgresql://postgres:EFhlhlwZqNzzSPuDmtEegbsHTHDZRyVQ@autorack.proxy.rlwy.net:15937/trumpbuybutik -c "SET CLIENT_ENCODING TO 'UTF8';" -f "%~dp0CreateTables.sql"

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to execute CreateTables.sql. Error level: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo CreateTables.sql executed successfully.

REM Step 3: Execute the 'PopulateDatabase.sql' script
echo Running PopulateDatabase.sql script...
psql postgresql://postgres:EFhlhlwZqNzzSPuDmtEegbsHTHDZRyVQ@autorack.proxy.rlwy.net:15937/trumpbuybutik -c "SET CLIENT_ENCODING TO 'UTF8';" -f "%~dp0PopulateDatabaseExternal.sql"

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to execute PopulateDatabase.sql. Error level: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo PopulateDatabase.sql executed successfully.
echo Database setup completed.
pause