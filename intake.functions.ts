import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const intakeSchema = z.object({
  company: z.string().trim().min(1).max(150),
  industry: z.string().trim().min(1).max(80),
  team_size: z.string().trim().max(40).optional().or(z.literal("")),
  current_tools: z.string().trim().max(1000).optional().or(z.literal("")),
  pain_points: z.string().trim().min(5).max(2000),
  goals: z.string().trim().min(5).max(2000),
});

export const submitIntake = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => intakeSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("audit_intakes").insert({
      user_id: userId,
      company: data.company,
      industry: data.industry,
      team_size: data.team_size || null,
      current_tools: data.current_tools || null,
      pain_points: data.pain_points,
      goals: data.goals,
    });
    if (error) {
      console.error("submitIntake error", error);
      throw new Error("Could not save intake.");
    }
    return { ok: true as const };
  });

export const listIntakes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("audit_intakes")
      .select("id, company, industry, pain_points, goals, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
