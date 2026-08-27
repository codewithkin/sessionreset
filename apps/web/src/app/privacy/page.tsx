import type { Metadata } from "next";

import { LegalPage, List, Section } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — Session Reset",
  description:
    "How Session Reset handles your data. Short version: your timers, settings and history stay on your device.",
};

const CONTACT = "kinzinzombe07@gmail.com";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="27 August 2026">
      <Section title="The short version">
        <p>
          Session Reset has no accounts and no server storing your content. Your timers,
          settings, and usage history stay in encrypted storage on your own device. We
          can&apos;t read them, we don&apos;t back them up, and we never sell them. If you
          uninstall the app, they&apos;re gone.
        </p>
        <p>
          The rest of this page explains the exceptions in plain terms — the anonymous analytics,
          the over-the-air updates, and the two ad and payment services we plan to add.
        </p>
      </Section>

      <Section title="Who this policy is from">
        <p>
          Session Reset is built by Kin Leon Zinzombe, who is responsible for this policy and
          for how the app handles data.
        </p>
        <p>
          The app is published to Google Play through the developer account of Wyven Technologies
          (Pvt) Ltd, so that name may appear as the seller or developer on the store listing.
          Wyven is the publisher of record only — it does not receive, store, or process any of
          your data, and it has no access to anything the app keeps on your device.
        </p>
      </Section>

      <Section title="What stays on your device">
        <p>
          The following is written to your device&apos;s own storage (MMKV with AES-256
          encryption) and never transmitted to us or anyone else:
        </p>
        <List
          items={[
            "Your active and past timers (which AI service, when you logged it, and the 5-hour countdown)",
            "Your settings (notification preferences, theme, language)",
            "Your usage log (when you logged timers and when they reset)",
            "Your onboarding answers",
          ]}
        />
        <p>
          There is no account to sign into and no sync. Nothing in this list leaves the device,
          which also means it does not move with you if you switch phones.
        </p>
      </Section>

      <Section title="What leaves your device">
        <p>
          Session Reset is a local-first app, so almost nothing talks to the internet. A few
          services do receive limited information, and none of them receive an identity because
          the app never creates one.
        </p>

        <p className="text-fg">Expo Insights (analytics)</p>
        <p>
          We use Expo Insights to understand basic app health — how many people open the app,
          which app version they&apos;re on, and whether it&apos;s crashing. This is anonymous
          and aggregated. It includes technical details like device model, operating system
          version, and app version. It does not include your name, email, your timers, or any
          content you log.
        </p>

        <p className="text-fg">Expo Updates (over-the-air updates)</p>
        <p>
          The app can download bug fixes without a full store update. To check whether an update
          applies to your device, it sends your app version and platform to Expo&apos;s servers.
        </p>

        <p className="text-fg">Google AdMob (advertising — future)</p>
        <p>
          We plan to show ads through Google AdMob in future versions of the app. When enabled,
          AdMob collects device identifiers (Advertising ID on Android), IP address, and
          interaction data (impressions, clicks). This data is processed by Google under their{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-brand hover:text-brand-bright"
            target="_blank"
            rel="noreferrer noopener"
          >
            Privacy Policy
          </a>
          . Ads are not currently active — all users have full Pro access today.
        </p>

        <p className="text-fg">RevenueCat (payments — future)</p>
        <p>
          We plan to offer a lifetime purchase through RevenueCat. If you make a purchase,
          RevenueCat processes the payment and sends us a receipt, user ID, and purchase status.
          We do not see your card details. RevenueCat&apos;s own{" "}
          <a
            href="https://www.revenuecat.com/privacy"
            className="text-brand hover:text-brand-bright"
            target="_blank"
            rel="noreferrer noopener"
          >
            Privacy Policy
          </a>{" "}
          governs how they handle that data.
        </p>
      </Section>

      <Section title="What we never do">
        <List
          items={[
            "We don't require an account, email address, or phone number",
            "We don't track you across other apps or websites",
            "We don't access your contacts, camera, photos, microphone, or location",
            "We don't record or analyse any content from your AI tools",
          ]}
        />
      </Section>

      <Section title="Permissions the app requests">
        <p>
          <span className="text-fg">Notifications.</span> Used for one thing: reminding you
          when your 5-hour window is about to reset. The notification is scheduled on your
          device — there is no push server, and declining this permission doesn&apos;t limit any
          other feature.
        </p>
      </Section>

      <Section title="Deleting your data">
        <p>
          Because everything lives on your device, you are always in full control. You can clear
          your timer history from the Settings screen, or simply uninstall Session Reset —
          uninstalling permanently removes your timers, settings, usage history, and onboarding
          answers. There is no server-side copy for us to delete, and no account to close.
        </p>
      </Section>

      <Section title="Children">
        <p>
          Session Reset is not directed at children under 13, and we do not knowingly collect
          personal information from them. Since the app collects no personal information from
          anyone, this is largely moot — but note that the app is intended for developers and
          technical users working with AI CLI tools.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If we ever start handling data differently, we&apos;ll update this page and change the
          effective date at the top. Material changes will also be noted in the app or its store
          listing.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy, or want to know exactly what we hold on you? Email{" "}
          <a
            href={`mailto:${CONTACT}`}
            className="text-brand hover:text-brand-bright"
          >
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
