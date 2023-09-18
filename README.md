# Bun and Prisma tryout

This project is a solution for the Digital Natives' [`node-todo` assessment](https://github.com/digitalnatives/assessment/tree/main/node-todo).

Deviations from the assessment task:

- I used `bun` instead of `node` to have a quick check about its capabilities.
- I used `Prisma` with `sqlite` instead of a JSON file to try Prisma.

## Pre-requisites

[`bun`](https://bun.sh/)

Theoretically the project should run with `node` too, but I haven't tried it.
I used `bun:test`for testing, so`bun` is a must for running the tests.

[`node` and `npm`](https://nodejs.org)

Even though `bun` should be a drop-in replacement for `node`,
the Prisma migration scripts threw an error when run with `bunx` instead of `npx`.

## ENV vars

- `DATABASE_URL` - Defines the database. It should be `"file:./dev.db"` or similar.
- `TODO_AUTOMATIC_DELETION_IN_MINS` - Defines how much time to wait before automatically deleting a done todo. Optional. Default value: `5`.

## Running the project

```bash
bun install
make dev
```

Since the migrations require `npx prisma migrate dev`, I created a Makefile script to help with that.
The Makefile script also sets the `DATABASE_URL` to `"file:./dev.db"`.

## Running the tests

```bash
bun install
make test
```

Once the migrations are in committed, the tests can be run with `bun test` too.

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
