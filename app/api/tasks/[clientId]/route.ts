import { supabase } from "@/lib/supabaseClient";

export async function GET(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("client_id", params.clientId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
