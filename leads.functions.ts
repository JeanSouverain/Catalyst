import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  industry: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      industry: data.industry || null,
      message: data.message,
    });
    if (error) {
      console.error("submitLead error", error);
      throw new Error("Could not submit. Please try again.");
    }
    return { ok: true as const };
  });
