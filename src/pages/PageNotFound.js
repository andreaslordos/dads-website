/** @jsxImportSource theme-ui */
import { useEffect } from "react";

export default function PageNotFound() {
  useEffect(() => {
    document.title = "Page not found";
  });

  return <p>404 Error: Page not found</p>;
}
