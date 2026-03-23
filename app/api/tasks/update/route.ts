import { supabase } from "@/lib/supabaseClient";

export async function PATCH(req: Request) {
  const { id, status } = await req.json();

  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
