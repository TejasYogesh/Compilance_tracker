import { supabase } from "@/lib/supabaseClient";

export async function GET(
  req: Request,
  context: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await context.params; // ✅ FIX

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("client_id", clientId)
    .order("due_date", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
