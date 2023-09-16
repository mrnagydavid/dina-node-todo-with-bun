.PHONY: test

test:
	export DATABASE_URL="file:./test.db" && npx prisma migrate dev
	bun test
