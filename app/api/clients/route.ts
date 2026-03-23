import { supabase } from "@/lib/supabaseClient";

// GET clients
export async function GET() {
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

// ADD client
export async function POST(req: Request) {
  const body = await req.json();

  const { company_name, country, entity_type } = body;

  if (!company_name) {
    return Response.json(
      { error: "Company name is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("clients").insert([
    {
      company_name,
      country,
      entity_type,
    },
  ]);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
