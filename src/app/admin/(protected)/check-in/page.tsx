import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { requireStaffOrAdmin } from "@/lib/session";
import { CheckInPanel } from "./check-in-panel";

export const dynamic = "force-dynamic";

export default async function AdminCheckInPage() {
  await requireStaffOrAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const labels = dict.admin.checkIn;

  return (
    <div className="container-page space-y-5 py-6 sm:py-8">
      <header>
        <h1 className="text-2xl font-bold text-navy-950">{labels.title}</h1>
        <p className="mt-1 text-sm text-muted">{labels.subtitle}</p>
      </header>

      <CheckInPanel
        locale={locale}
        labels={{
          scanTitle: labels.scanTitle,
          scanDescription: labels.scanDescription,
          startCamera: labels.startCamera,
          stopCamera: labels.stopCamera,
          cameraError: labels.cameraError,
          manualTitle: labels.manualTitle,
          manualDescription: labels.manualDescription,
          placeholder: labels.placeholder,
          submit: labels.submit,
          submitting: labels.submitting,
          validTitle: labels.validTitle,
          validBody: labels.validBody,
          alreadyTitle: labels.alreadyTitle,
          alreadyBody: labels.alreadyBody,
          cancelledTitle: labels.cancelledTitle,
          cancelledBody: labels.cancelledBody,
          invalidTitle: labels.invalidTitle,
          invalidBody: labels.invalidBody,
          at: labels.at,
          operator: labels.operator,
          clear: labels.clear,
          scanHint: dict.ticket.scanHint,
        }}
      />
    </div>
  );
}
