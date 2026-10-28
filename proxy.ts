import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Solo corre en las secciones privadas; la web pública no se toca.
export const config = {
  matcher: ["/aula/:path*", "/admin/:path*", "/login"],
};
