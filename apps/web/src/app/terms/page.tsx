import type { Metadata } from "next";

import { LegalPage, List, Section } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service — Session Reset",
  description: "The terms you agree to when you use Session Reset.",
};

const CONTACT = "kinzinzombe07@gmail.com";

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" effectiveDate="27 August 2026">
      <Section title="Agreement">
        <p>
          These terms apply when you download or use Session Reset (the &quot;app&quot;). If you
          don&apos;t agree with them, don&apos;t use the app. If you do use it, you&apos;re
          agreeing to what&apos;s below.
        </p>
      </Section>

      <Section title="Who you're dealing with">
        <p>
          Session Reset is built and owned by Kin Leon Zinzombe (&quot;we&quot;, &quot;us&quot;).
          All rights in the app belong to us.
        </p>
        <p>
          The app is distributed on Google Play through the developer account of Wyven
          Technologies (Pvt) Ltd, which publishes it on our behalf. That means Wyven&apos;s name
          may appear as the seller or developer on that store listing. Wyven acts purely as the
          publisher of record — it does not own the app, does not control how it works, and does
          not receive or process your data. Questions about the app, these terms, or your data
          should come to us at the address at the bottom of this page.
        </p>
      </Section>

      <Section title="What Session Reset is">
        <p>
          Session Reset is a timer utility for developers who use AI CLI tools like Claude and
          Codex. It tracks 5-hour rolling reset windows and sends you a reminder before your
          window resets. It runs entirely on your device — there&apos;s no account to create and
          no server holding your content.
        </p>
        <p>
          It is a timer, not an AI service. We do not operate, control, or provide any AI
          tools. Our timers help you work around rate limits, but we cannot guarantee that a
          particular AI service will be available at any given time.
        </p>
      </Section>

      <Section title="Your responsibilities">
        <List
          items={[
            "Use the app lawfully, and don't use it to do anything illegal",
            "Don't reverse-engineer, decompile, or attempt to extract the app's source code",
            "Don't redistribute, resell, or sublicense the app",
          ]}
        />
      </Section>

      <Section title="Your data is yours">
        <p>
          Your timers, settings, and usage history belong to you and stay on your device. We
          claim no ownership of them and, as explained in the{" "}
          <a href="/privacy" className="text-brand hover:text-brand-bright">
            Privacy Policy
          </a>
          , neither we nor our publisher ever receive them.
        </p>
        <p>
          Because they live only on your device, you are solely responsible for them. If you lose
          your device, uninstall the app, or clear its data, that content is gone permanently and
          we cannot recover it for you.
        </p>
      </Section>

      <Section title="Pricing and future paid features">
        <p>
          The current version of Session Reset is free. Every feature in the app today is
          available to you at no cost — Pro features are currently unlocked for all users.
        </p>
        <p>
          We may introduce ads and paid features in a future version. Ads, when enabled, would
          be provided by Google AdMob. A one-time lifetime purchase to remove ads and unlock all
          features may be offered through RevenueCat. Pricing will be shown clearly before you
          buy anything, and you will never be charged without explicitly confirming the purchase.
          Features that are free today will not be taken away and put behind a paywall for
          existing users without notice.
        </p>
        <p>
          Should paid features be introduced, payments would be processed by Google Play rather
          than by us, and refunds would be handled entirely by whichever store you purchased
          through, under that store&apos;s own refund policy. We would not be able to issue
          refunds directly. These terms will be updated with full payment details before any paid
          feature goes live.
        </p>
      </Section>

      <Section title="AI services are third-party">
        <p>
          Session Reset helps you track time windows for AI CLI tools such as Claude and Codex.
          These services are operated by third parties and are not affiliated with, endorsed by,
          or sponsored by Session Reset. We do not control the availability, pricing, rate
          limits, or terms of service of any AI tool.
        </p>
        <p>
          You are responsible for making sure your use of any AI tool complies with that
          tool&apos;s own terms of service. Session Reset is a scheduling utility — it does not
          interact with, automate, or circumvent any AI service.
        </p>
      </Section>

      <Section title="Availability and changes">
        <p>
          We may update, change, or discontinue features at any time. We may also deliver bug
          fixes and improvements over the air. We try to keep the app working well, but we
          don&apos;t guarantee it will always be available, uninterrupted, or error-free.
        </p>
      </Section>

      <Section title="Disclaimer and liability">
        <p>
          The app is provided &quot;as is&quot; and &quot;as available&quot;, without warranties
          of any kind, whether express or implied, to the fullest extent permitted by law.
        </p>
        <p>
          To the fullest extent permitted by law, we are not liable for any indirect, incidental,
          or consequential damages arising from your use of the app — including lost data,
          missed AI resets, or rate limits incurred because you relied on the app&apos;s
          reminders. Where liability cannot be excluded, it is limited to the amount you actually
          paid for the app in the twelve months before the claim, which for the current free
          version is zero.
        </p>
        <p>
          Nothing in these terms limits any rights you have under mandatory consumer protection
          law in your country.
        </p>
      </Section>

      <Section title="Termination">
        <p>
          You can stop using Session Reset at any time by uninstalling it. We may suspend access
          if you materially breach these terms.
        </p>
      </Section>

      <Section title="Governing law">
        <p>
          These terms are governed by the laws of Zimbabwe. Any dispute will be subject to the
          courts of Zimbabwe, except where mandatory law in your country of residence gives you
          the right to bring proceedings locally.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may revise these terms from time to time. The effective date at the top will change
          when we do. Continuing to use the app after an update means you accept the revised
          terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Email{" "}
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
