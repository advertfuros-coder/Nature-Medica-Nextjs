#!/bin/bash

# Script to fix Next.js 15 async params issue across all dynamic routes

echo "Fixing async params in dynamic routes..."

# List of files to fix
files=(
  "src/app/api/admin/reviews/[id]/route.js"
  "src/app/api/admin/categories/[id]/route.js"
  "src/app/api/admin/returns/[id]/update-status/route.js"
  "src/app/api/admin/coupons/[id]/route.js"
  "src/app/api/admin/banners/[id]/route.js"
  "src/app/api/admin/products/[id]/badges/route.js"
  "src/app/api/admin/products/[id]/route.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    # Replace params.id with await params then destructure
    sed -i.bak 's/params\.id/(await params)\.id/g' "$file"
    echo "✓ Fixed: $file"
  else
    echo "⚠ File not found: $file"
  fi
done

echo "Done! Please review the changes."
