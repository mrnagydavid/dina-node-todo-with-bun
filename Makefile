.PHONY: test

test:
	export DATABASE_URL="file:./test.db" && npx prisma migrate dev
	bun test

dev:
	export DATABASE_URL="file:./dev.db" && npx prisma migrate dev && bun run --watch index.ts
