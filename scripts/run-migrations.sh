#!/bin/bash

echo "========================================"
echo "Interfaith Peace Bridge - Database Migration"
echo "========================================"
echo ""

# Use env vars if set, otherwise fallback to defaults
export PGPASSWORD="${PGPASSWORD:-your_password}"
export PGUSER="${PGUSER:-postgres}"
export PGHOST="${PGHOST:-localhost}"
export PGPORT="${PGPORT:-5432}"
export PGDATABASE="${PGDATABASE:-interfaith_db}"

echo "Step 1: Creating database (if not exists)..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d postgres -c "CREATE DATABASE interfaith_db;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "Database created successfully!"
else
    echo "Database already exists or error occurred. Continuing..."
fi
echo ""

echo "Step 2: Enabling UUID extension..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
echo ""

echo "Step 3: Running migrations in order..."
echo ""

echo "[1/14] Creating interfaith schema v2..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405022126_create_interfaith_schema_v2.sql"
echo ""

echo "[2/14] Adding all world religions..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405023448_add_all_world_religions.sql"
echo ""

echo "[3/14] Adding comprehensive misconceptions..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405023754_add_comprehensive_misconceptions.sql"
echo ""

echo "[4/14] Completing all misconceptions..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405024416_complete_all_misconceptions.sql"
echo ""

echo "[5/14] Final misconceptions completion..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405024439_final_misconceptions_completion.sql"
echo ""

echo "[6/14] Adding interfaith similarities schema..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405024817_add_interfaith_similarities_schema.sql"
echo ""

echo "[7/14] Populating interfaith similarities..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405024957_populate_interfaith_similarities.sql"
echo ""

echo "[8/14] Fixing similarity RLS policies..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405025308_fix_similarity_rls_policies.sql"
echo ""

echo "[9/14] Creating movement members schema..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405075232_create_movement_members_schema.sql"
echo ""

echo "[10/14] Creating newsletter subscribers schema..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405075554_create_newsletter_subscribers_schema.sql"
echo ""

echo "[11/14] Creating faith assessment schema..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405080723_create_faith_assessment_schema.sql"
echo ""

echo "[12/14] Creating faith assessment schema (duplicate)..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405081703_20260405080723_create_faith_assessment_schema.sql"
echo ""

echo "[13/14] Creating sacred texts explorer schema..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405095159_create_sacred_texts_explorer_schema.sql"
echo ""

echo "[14/14] Populating sacred texts data..."
psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f "../data/migrations/20260405095323_populate_sacred_texts_data.sql"
echo ""

echo "========================================"
echo "Migration completed!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Update your .env file with DATABASE_URL"
echo "2. Run: npx prisma generate"
echo "3. Run: npm run dev"
echo ""
