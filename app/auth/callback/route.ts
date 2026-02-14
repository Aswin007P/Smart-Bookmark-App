import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("🔵 CALLBACK GET HIT - URL:", request.url);
  
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    
    console.log("🔵 Code received:", code ? "YES" : "NO");

    if (!code) {
      console.log("🔴 No code found");
      return NextResponse.redirect(`${origin}/login?error=no_code`);
    }

    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    console.log("🔵 Exchanging code for session...");
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("🔴 Exchange error:", error);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }

    console.log("🔵 Success! Redirecting to dashboard");
    return NextResponse.redirect(`${origin}/dashboard`);
    
  } catch (error) {
    console.error("🔴 Callback error:", error);
    return NextResponse.redirect(`${origin}/login?error=callback_error`);
  }
}

// Important: Also handle POST if needed (but we only need GET)
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}