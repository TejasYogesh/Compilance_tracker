import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();

  const { client_id, title, due_date, category, priority } = body;

  if (!client_id || !title) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase.from("tasks").insert([
    {
      client_id,
      title,
      due_date,
      category,
      priority,
      status: "pending",
    },
  ]);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
