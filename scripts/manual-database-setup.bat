@echo off
REM ========================================
REM Manual Database Creation Script
REM Run this to create the database manually
REM ========================================

echo.
echo ========================================
echo Creating PostgreSQL Database Manually
echo ========================================
echo.
echo This script will:
echo 1. Create the interfaith_db database
echo 2. Enable UUID extension
echo 3. Run all 14 migration files
echo.
echo IMPORTANT: You will be prompted for your PostgreSQL password multiple times.
echo.
pause

REM Prompt for PostgreSQL password
set /p PGPASSWORD="Enter your PostgreSQL password: "
echo.

echo Step 1: Creating database...
psql -U postgres -c "CREATE DATABASE interfaith_db;" 2>nul
if %errorlevel% equ 0 (
    echo SUCCESS: Database created!
) else (
    echo Database may already exist, continuing...
)
echo.
pause

echo Step 2: Enabling UUID extension...
psql -U postgres -d interfaith_db -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
if %errorlevel% equ 0 (
    echo SUCCESS: UUID extension enabled!
) else (
    echo ERROR: Failed to enable UUID extension
    pause
    exit /b 1
)
echo.
pause

echo Step 3: Running migration files...
echo This will take a few moments...
echo.

echo [1/14] Creating interfaith schema v2...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405022126_create_interfaith_schema_v2.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 1 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 1 complete
echo.

echo [2/14] Adding all world religions...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405023448_add_all_world_religions.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 2 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 2 complete
echo.

echo [3/14] Adding comprehensive misconceptions...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405023754_add_comprehensive_misconceptions.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 3 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 3 complete
echo.

echo [4/14] Completing all misconceptions...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405024416_complete_all_misconceptions.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 4 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 4 complete
echo.

echo [5/14] Final misconceptions completion...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405024439_final_misconceptions_completion.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 5 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 5 complete
echo.

echo [6/14] Adding interfaith similarities schema...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405024817_add_interfaith_similarities_schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 6 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 6 complete
echo.

echo [7/14] Populating interfaith similarities...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405024957_populate_interfaith_similarities.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 7 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 7 complete
echo.

echo [8/14] Fixing similarity RLS policies...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405025308_fix_similarity_rls_policies.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 8 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 8 complete
echo.

echo [9/14] Creating movement members schema...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405075232_create_movement_members_schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 9 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 9 complete
echo.

echo [10/14] Creating newsletter subscribers schema...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405075554_create_newsletter_subscribers_schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 10 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 10 complete
echo.

echo [11/14] Creating faith assessment schema...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405080723_create_faith_assessment_schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 11 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 11 complete
echo.

echo [12/14] Creating faith assessment schema (duplicate)...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405081703_20260405080723_create_faith_assessment_schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 12 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 12 complete
echo.

echo [13/14] Creating sacred texts explorer schema...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405095159_create_sacred_texts_explorer_schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 13 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 13 complete
echo.

echo [14/14] Populating sacred texts data...
psql -U postgres -d interfaith_db -f "../data/migrations/20260405095323_populate_sacred_texts_data.sql"
if %errorlevel% neq 0 (
    echo ERROR: Migration 14 failed
    pause
    exit /b 1
)
echo SUCCESS: Migration 14 complete
echo.

echo ========================================
echo ALL MIGRATIONS COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Verifying database...
psql -U postgres -d interfaith_db -c "\dt"
echo.
echo Checking record counts...
psql -U postgres -d interfaith_db -c "SELECT 'traditions' as table_name, COUNT(*) as count FROM traditions UNION ALL SELECT 'teachings', COUNT(*) FROM teachings UNION ALL SELECT 'sacred_texts', COUNT(*) FROM sacred_texts UNION ALL SELECT 'similarity_themes', COUNT(*) FROM similarity_themes;"
echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure .env file with your database URL
echo 2. Run: npx prisma generate
echo 3. Run: npm run dev
echo.
pause
