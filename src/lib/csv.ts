export interface CsvRegistrationRow {
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  company: string;
  jobTitle: string;
  organizationType: string;
  interest: string | null;
  locale: string;
  status: string;
  ticketStatus: string | null;
  createdAt: Date;
  checkedInAt: Date | null;
}

function cell(value: string | null | undefined): string {
  const text = value ?? "";
  return `"${text.replaceAll('"', '""')}"`;
}

export function registrationsToCsv(rows: CsvRegistrationRow[]): string {
  const header = [
    "Registration No",
    "Full Name",
    "Email",
    "Phone",
    "Country Code",
    "City",
    "Company",
    "Job Title",
    "Organisation Type",
    "Interest",
    "Locale",
    "Registration Status",
    "Ticket Status",
    "Registered At (ISO)",
    "Checked In At (ISO)",
  ];
  const lines = [header.map(cell).join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.registrationNumber,
        row.fullName,
        row.email,
        row.phone,
        row.countryCode,
        row.city,
        row.company,
        row.jobTitle,
        row.organizationType,
        row.interest ?? "",
        row.locale,
        row.status,
        row.ticketStatus ?? "",
        row.createdAt.toISOString(),
        row.checkedInAt?.toISOString() ?? "",
      ]
        .map(cell)
        .join(","),
    );
  }
  // UTF-8 BOM so Excel opens Arabic names correctly.
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}
