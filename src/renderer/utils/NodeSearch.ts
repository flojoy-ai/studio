export const matchesQuery = (s: string | undefined, query: string) =>
  Boolean(
    query !== "" &&
      s
        ?.toLocaleLowerCase()
        .split("_")
        .join("")
        .includes(
          query
            .toLocaleLowerCase()
            .split(/[\s_]+/)
            .join(""),
        ),
  );
