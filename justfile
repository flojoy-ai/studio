sync:
  poetry run python3 fjblock.py sync

add args:
  poetry run python3 fjblock.py add {{invocation_directory()}}/{{args}}

init:
  just init-docs & just init-blocks

init-docs:
  cd docs && pnpm install

init-blocks:
  poetry install

update:
  just update-docs & just update-blocks

update-docs:
  cd docs && pnpm update

update-blocks:
  poetry update

dev:
  cd docs && pnpm dev

build:
  cd docs && pnpm build

format:
  poetry run ruff format .

lint:
  poetry run ruff check .
