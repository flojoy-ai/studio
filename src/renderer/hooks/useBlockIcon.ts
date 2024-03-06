import { fromPromise, okAsync } from "neverthrow";
import { useEffect, useReducer, useRef, useState } from "react";

type SvgComponent = React.FC<React.SVGProps<SVGElement>>;

const cache = new Map<string, SvgComponent>();

const importComponent = (category: string, name = "default") => {
  const key = `${category}/${name}`;
  const cached = cache.get(key);
  if (cached) {
    return okAsync(cached);
  }

  return fromPromise(
    import(`../assets/blocks/${category}/${name}.svg?react`),
    (e) => e,
  ).map((mod) => {
    cache.set(key, mod.default);
    return mod.default;
  });
};

export const useBlockIcon = (category: string, name: string) => {
  const importedIconRef = useRef<SvgComponent>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    setLoading(true);
    const importSvgIcon = async (): Promise<void> => {
      const icon = await importComponent(category, name).orElse(() =>
        importComponent(category),
      );
      icon.match(
        (icon) => (importedIconRef.current = icon),
        (err) => setError(err),
      );
      setLoading(false);
    };

    importSvgIcon().then(() => forceUpdate());
  }, [name, category]);

  return { error, loading, SvgIcon: importedIconRef.current };
};
