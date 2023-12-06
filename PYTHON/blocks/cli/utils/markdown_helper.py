def get_markdown_slug(title: str) -> str:
    return title.replace("_", "-").lower()
