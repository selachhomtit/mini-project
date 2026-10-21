import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { loadLanguageFromStorage } from "@/lib/features/i18n/i18nSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadLanguageFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
