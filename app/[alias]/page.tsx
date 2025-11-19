import { redirect } from "next/navigation";
import { getUrlByAlias } from "@/lib/getUrlByAlias";

type Props = {
  params: Promise<{ alias: string }>;
};

export default async function AliasRedirectPage({ params }: Props) {
  const { alias } = await params;
  const record = await getUrlByAlias(alias);

  if (!record) {
    // If alias not found, send back home
    redirect("/");
  }

  // Requirement #4 – visiting /alias redirects automatically
  redirect(record.targetUrl);
}
