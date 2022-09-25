import { useEffect } from "react";
import { deleteSome, putSome } from "./templateService";
import { useTemplateState } from "./templateState";

export function useTemplateEffects() {
  const { propertyA: a, propertyB: b, setPropertyA } = useTemplateState();

  useEffect(() => {
    deleteSome(a);
  }, [a]);

  useEffect(() => {
    setPropertyA(b.id);
    putSome(b);
  }, [b, setPropertyA]);
}
