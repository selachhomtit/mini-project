import { Suspense } from "react";
import TeamPageClient from "@/components/team/TeamPageClient";

export default function Page() {
  return (
    <Suspense>
      <TeamPageClient />
    </Suspense>
  );
}
