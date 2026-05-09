@echo off
echo ========================================
echo Interfaith Peace Bridge
echo Complete Migration Setup Script
echo ========================================
echo.
echo This script will guide you through the complete migration process.
echo.
pause

echo.
echo ========================================
echo Step 1: Installing Prisma Dependencies
echo ========================================
echo.
call npm install prisma @prisma/client
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Prisma dependencies
    pause
    exit /b 1
)
echo.
echo SUCCESS: Prisma dependencies installed!
echo.
pause

echo.
echo ========================================
echo Step 2: Environment Configuration
echo ========================================
echo.
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file and set your PostgreSQL password!
    echo Open .env and replace YOUR_PASSWORD with your actual PostgreSQL password.
    echo.
    echo Press any key after you've updated the .env file...
    pause
) else (
    echo .env file already exists.
    echo Make sure DATABASE_URL is configured correctly.
    echo.
    pause
)

echo.
echo ========================================
echo Step 3: Running Database Migrations
echo ========================================
echo.
echo This will create the database and run all 14 migration files.
echo.
pause

cd scripts
call run-migrations.bat
cd ..

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Migration failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo SUCCESS: All migrations completed!
echo.
pause

echo.
echo ========================================
echo Step 4: Generating Prisma Client
echo ========================================
echo.
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo.
echo SUCCESS: Prisma Client generated!
echo.
pause

echo.
echo ========================================
echo Step 5: Verifying Database
echo ========================================
echo.
echo Checking database tables...
psql -U postgres -d interfaith_db -c "\dt" 2>nul
if %errorlevel% neq 0 (
    echo WARNING: Could not verify database tables
    echo This might be normal if psql is not in your PATH
) else (
    echo.
    echo Database tables verified!
)
echo.
pause

echo.
echo ========================================
echo MIGRATION COMPLETE!
echo ========================================
echo.
echo Your application is now ready to use with:
echo   - Local PostgreSQL database
echo   - Prisma ORM
echo   - All 14 tables created and populated
echo.
echo Next steps:
echo   1. Start development server: npm run dev
echo   2. Open Prisma Studio: npm run db:studio
echo   3. Test your application at http://localhost:3060
echo.
echo Documentation:
echo   - FINAL_SUMMARY.md - Complete migration summary
echo   - MIGRATION_GUIDE.md - Detailed guide
echo   - QUICK_START.md - Quick reference
echo.
echo ========================================
echo.
pause

echo.
echo Would you like to start the development server now? (Y/N)
set /p START_DEV=
if /i "%START_DEV%"=="Y" (
    echo.
    echo Starting development server...
    echo Press Ctrl+C to stop the server when done.
    echo.
    call npm run dev
)

echo.
echo Thank you for using the migration script!
echo.
pause
