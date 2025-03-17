@echo off
chcp 1252
echo Creating database 'Eksamen'...

REM Step 1: Create the database 'Eksamen' with owner 'ahmed'
psql postgresql://postgres:ahmedahmed@localhost:5432 -c "SET CLIENT_ENCODING TO 'UTF8';" -c "CREATE DATABASE eksamen OWNER ahmed;"

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to create database. Error level: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo Database 'Eksamen' created successfully.

REM Step 2: Connect to the database 'Eksamen' and execute the 'CreateTables.sql' script
echo Running CreateTables.sql script...
psql postgresql://ahmed:ahmedahmed@localhost:5432/eksamen -c "SET CLIENT_ENCODING TO 'UTF8';" -f "%~dp0CreateTables.sql"

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to execute CreateTables.sql. Error level: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo CreateTables.sql executed successfully.

REM Step 3: Execute the 'PopulateDatabase.sql' script
echo Running PopulateDatabase.sql script...
psql postgresql://ahmed:ahmedahmed@localhost:5432/eksamen -c "SET CLIENT_ENCODING TO 'UTF8';" -f "%~dp0PopulateDatabase.sql"

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to execute PopulateDatabase.sql. Error level: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo PopulateDatabase.sql executed successfully.
echo Database setup completed.
pause