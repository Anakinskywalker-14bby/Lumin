import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * /verify?token=...
 * The email's call-to-action. Hands the token straight to the quiz so the
 * user lands on question one — proof they opened the email.
 */
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  redirect(token ? `/quiz?token=${encodeURIComponent(token)}` : "/quiz");
}
