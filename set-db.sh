unset NODE_TLS_REJECT_UNAUTHORIZED
export NEON_API_KEY=$(cat .neon_key)

GIT_BRANCH=$(git branch --show-current)

if [ "$1" != "" ] && [ "$1" != "main" ]; then
    POOLED_STRING=$(npx neon connection-string $1 --pooled)
    PRISMA_STRING=$(npx neon connection-string $1 --prisma)
    printf "DATABASE_URL=%s\nDATABASE_URL_UNPOOLED=%s\n" "$POOLED_STRING" "$PRISMA_STRING" > .env
elif [ "$GIT_BRANCH" != "main" ]; then
    POOLED_STRING=$(npx neon connection-string preview/$GIT_BRANCH --pooled)
    PRISMA_STRING=$(npx neon connection-string preview/$GIT_BRANCH --prisma)
    printf "DATABASE_URL=%s\nDATABASE_URL_UNPOOLED=%s\n" "$POOLED_STRING" "$PRISMA_STRING" > .env
fi
