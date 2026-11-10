import { redirect } from "next/navigation";

import LandingPage from "../../components/landing-page";
import { getViewer } from "../../lib/current-user";

export default async function HomePage() {
  const viewer = await getViewer();

  if (viewer.signedIn) {
    redirect("/dashboard");
  }

  return <LandingPage demoAvailable={viewer.demoAvailable} />;
}
