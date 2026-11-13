"use client";

import * as React from "react";
import { CoverSection } from "@/components/wedding/sections/cover";
import { SaveTheDateSection } from "@/components/wedding/sections/save-the-date";
import { InvitationSection } from "@/components/wedding/sections/invitation";
import { EventDetailsSection } from "@/components/wedding/sections/event-details";
import { GiftSection } from "@/components/wedding/sections/gift";
import { CountdownSection } from "@/components/wedding/sections/countdown";
import { RsvpSection } from "@/components/wedding/sections/rsvp";
import { ClosingSection } from "@/components/wedding/sections/closing";
import GuestManager from "@/components/wedding/guest-manager";

export default function Home() {
  const [opened, setOpened] = React.useState(false);
  const [isManage, setIsManage] = React.useState(false);

  React.useEffect(() => {
    setIsManage(
      new URLSearchParams(window.location.search).has("manage")
    );
  }, []);

  const handleOpen = React.useCallback(() => {
    setOpened(true);
    requestAnimationFrame(() => {
      const el = document.getElementById("save-the-date");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // ?manage → halaman admin kelola tamu (bukan undangan).
  if (isManage) {
    return <GuestManager />;
  }

  return (
    <main className="flex min-h-[100svh] w-full flex-col bg-cream">
      <div className="mx-auto w-full max-w-[480px] bg-cream shadow-sm">
        {/* Before opening: show Cover (full screen).
            After opening: hide Cover and reveal the rest.
            Section order:
            1. Cover  2. Save the Date  3. Data Mempelai
            4. Detail Acara  5. Gift  6. Countdown
            7. RSVP  8. Penutup */}
        {!opened ? (
          <CoverSection onOpen={handleOpen} />
        ) : (
          <>
            <SaveTheDateSection />
            <InvitationSection />
            <EventDetailsSection />
            <GiftSection />
            <CountdownSection />
            <RsvpSection />
            <ClosingSection />
          </>
        )}
      </div>
    </main>
  );
}
