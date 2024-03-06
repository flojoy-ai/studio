import { useEffect, useRef, useState } from "react";

export const useBlockIcon = (category: string, name: string) => {
  const importedIconRef = useRef<React.FC<React.SVGProps<SVGElement>>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setLoading(true);
    const importSvgIcon = async (): Promise<void> => {
      try {
        const res = await import(
          `../assets/blocks/${category}/${name}.svg?react`
        );
        importedIconRef.current = res.default;
      } catch (err) {
        try {
          const res = await import(
            `../assets/blocks/${category}/default.svg?react`
          );
          importedIconRef.current = res.default;
        } catch {
          //
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    importSvgIcon();
  }, [name, category]);

  return { error, loading, SvgIcon: importedIconRef.current };
};
