import Image from "next/image";
import Link from "next/link";
import { Loader2, MessageCircle, QrCode, ShieldCheck, Ticket, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/format";
import { getDictionary, getLocale } from "@/i18n";
import { getEventSettings } from "@/lib/site-content";
import { getTicketByRawToken } from "@/lib/registration-service";
import { getLatestEmailStatus } from "@/lib/email";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSiteUrl } from "@/lib/crypto";

export default async function TicketPage() {
  const { token } = useParams();

  if (!token) {
    return <p>{"Invalid ticket token"}</p>;
  }

  const dict = getDictionary("ar");
  const settings = await getEventSettings();
  const ticket = await getTicketByRawToken(token);

  return (
    <div className="min-h-screen bg-cream-100">
      <h1 className="text-3xl font-bold text-navy-950">{dict.ticket.pageTitle}</h1>

      {ticket ? (
        <div className="p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <QrCode value={ticket.qrToken} className="h-32 w-32" />
            <p>{dict.ticket.qrCode}</p>
          </div>

          <h2 className="text-2xl font-bold mb-4">{ticket.fullName}</h2>

          <p>{dict.ticket.registrationNumber}: {ticket.registrationNumber}</p>

          <Button
            href={`https://wa.me/?text=${encodeURIComponent(dict.ticket.whatsappShare)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {dict.ticket.whatsappShare}
          </Button>

          <Badge>{dict.ticket.status}</Badge>
        </div>
      ) : (
        <p>{dict.ticket.invalidTicket}</p>
      )}
    </div>
  );
}