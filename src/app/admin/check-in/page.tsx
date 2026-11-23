import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getDictionary, getLocale } from "@/i18n";
import { prisma } from "@/lib/db";

export default function AdminCheckInPage() {
  const [locale, setLocale] = useState<Locale | null>(null);
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    async function fetchLocale() {
      const locale = await getLocale();
      setLocale(locale);
      setDict(getDictionary(locale));
    }
    fetchLocale();
  }, []);

  useEffect(() => {
    // Auto-clear query after 5 seconds
    const timer = setTimeout(() => setQuery(""), 5000);
    return () => clearTimeout(timer);
  }, [query]);
  const [checkedIn, setCheckedIn] = useState(null);

  useEffect(() => {
    // Auto-clear query after 5 seconds
    const timer = setTimeout(() => setQuery(""), 5000);
    return () => clearTimeout(timer);
  }, [query]);

  const handleCheckIn = async (regNumber: string) => {
    try {
      const reg = regNumber.trim().toUpperCase();
      const registration = await prisma.registration.findFirst({
        where: { registrationNumber: reg },
      });
      if (!registration) {
        setCheckedIn({ state: "INVALID", message: "not_found" });
        return;
      }
      if (registration.status === "CANCELLED") {
        setCheckedIn({ state: "CANCELLED", message: "cancelled" });
        return;
      }
      // Check if already checked in
      const existingCheckIn = await prisma.checkIn.findFirst({
        where: { registrationId: registration.id },
      });
      if (existingCheckIn) {
        setCheckedIn({ state: "ALREADY_CHECKED_IN" });
        return;
      }
      await prisma.checkIn.create({
        data: {
          registrationId: registration.id,
          method: "MANUAL",
          gate: "main",
        },
      });
      setCheckedIn({
        state: "VALID",
        registration: {
          fullName: registration.fullName,
          registrationNumber: registration.registrationNumber,
        },
        checkedInAt: new Date(),
      });
    } catch (error) {
      console.error("[check-in] error", error);
      setCheckedIn({ state: "INVALID", message: "system_error" });
    }
  };

  return (
    <section className="min-h-screen bg-cream-100">
      <div className="container-page p-6 sm:p-8 lg:p-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-navy-950">
            {dict.nav.checkin}
          </h1>
          <p className="text-muted mt-1">
            {dict.auth.staffNotice}
          </p>
        </header>

        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-[0.7rem] font-medium text-navy-800 uppercase tracking-wider">
                Scan QR
              </p>
              <p className="mt-3 text-lg text-navy-900">Scan ticket QR code</p>
              <Button variant="gold" size="lg" onClick={() => {}}>
                <Ticket className="h-4.5 w-4.5" aria-hidden="true" />
                Scan
              </Button>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium text-navy-800 uppercase tracking-wider">
                Enter Number
              </p>
              <Input
                name="registrationNumber"
                type="text"
                placeholder="MFF-2027-01001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={false}
                maxLength={20}
                autoComplete="off"
              />
              <Button variant="gold" size="lg" onClick={() => handleCheckIn(query)}>
                <Check className="h-4 w-4" aria-hidden="true" />
                Check In
              </Button>
            </div>
          </div>
        </div>

        {checkedIn && (
          <div className="mt-6 p-6 rounded-2xl border-border">
            {checkedIn.state === "VALID" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <Check className="h-6 w-6 text-emerald-600 mb-4" aria-hidden="true" />
                <p className="text-[0.85rem] font-medium text-navy-900">
                  Check-in successful
                </p>
                <p className="mt-2 text-muted">
                  {checkedIn.fullName} — {checkedIn.registrationNumber}
                </p>
                <p className="mt-2 text-sm text-emerald-700">
                  Checked in at: {checkedIn.checkedInAt?.toLocaleString()}
                </p>
              </div>
            )}
            {checkedIn.state === "ALREADY_CHECKED_IN" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <Clock className="h-6 w-6 text-amber-600 mb-4" aria-hidden="true" />
                <p className="text-[0.85rem] font-medium text-navy-900">
                  Already checked in
                </p>
              </div>
            )}
            {checkedIn.state === "CANCELLED" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <AlertCircle className="h-6 w-6 text-red-600 mb-4" aria-hidden="true" />
                <p className="text-[0.85rem] font-medium text-navy-900">
                  {dict.ticket.cancelled}
                </p>
              </div>
            )}
            {checkedIn.state === "INVALID" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <AlertCircle className="h-6 w-6 text-red-600 mb-4" aria-hidden="true" />
                <p className="text-[0.85rem] font-medium text-navy-900">
                  Invalid ticket
                </p>
                {checkedIn.message && (
                  <p className="mt-2 text-sm text-red-700">{checkedIn.message}</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-sm text-muted-soft">
          <p>Scan the QR code on the ticket to check in</p>
          <p>Or enter the registration number manually</p>
        </div>
      </div>
    </section>
  );
}