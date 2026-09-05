import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * /verify?token=...
 * The email's call-to-action. Hands the token straight to the quiz so the
 * user lands on question one — proof they opened the email.
 */
export default function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = typeof searchParams.token === "string" ? searchParams.token : "";
  redirect(token ? `/quiz?token=${encodeURIComponent(token)}` : "/quiz");
}
