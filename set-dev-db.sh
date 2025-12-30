unset NODE_TLS_REJECT_UNAUTHORIZED
export NEON_API_KEY=$(cat .neon_key)

GIT_BRANCH=$(git branch --show-current)

if [ "$GIT_BRANCH" = "main" ]; then
  return
fi

POOLED_STRING=$(npx neon connection-string preview/$GIT_BRANCH --pooled)
PRISMA_STRING=$(npx neon connection-string preview/$GIT_BRANCH --prisma)
echo "DATABASE_URL=$POOLED_STRING\nDATABASE_URL_UNPOOLED=$PRISMA_STRING" > .env