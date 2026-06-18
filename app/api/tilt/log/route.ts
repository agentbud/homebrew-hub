import { NextResponse } from "next/server";

// Convert ANY Google Sheets URL into gviz JSON export URL
function toGvizUrl(url: string) {
  const idMatch = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const gidMatch = url.match(/gid=([0-9]+)/);

  if (!idMatch) return null;

  const id = idMatch[1];
  const gid = gidMatch ? gidMatch[1] : "0";

  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&gid=${gid}`;
}

// Parse Google Sheets gviz JSON
function parseGviz(text: string) {
  const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
  if (!match) return null;

  const json = JSON.parse(match[1]);
  return json.table;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const gvizUrl = toGvizUrl(rawUrl);
  if (!gvizUrl) {
    return NextResponse.json({ error: "Invalid Google Sheets URL" }, { status: 400 });
  }

  try {
    const res = await fetch(gvizUrl);
    if (!res.ok) throw new Error("Fetch failed");

    const text = await res.text();
    if (!text.includes("google.visualization.Query.setResponse")) {
      throw new Error("Not gviz JSON");
    }

    const table = parseGviz(text);
    if (!table) throw new Error("Unable to parse gviz");

    // Build header → index map
    const headerMap: Record<string, number> = {};
    table.cols.forEach((col: any, idx: number) => {
      const label = (col.label || "").trim();
      if (label) headerMap[label] = idx;
    });

    // Resolve temperature column (multiple possible names)
    const tempHeader =
      headerMap["Temp (°F)"] ??
      headerMap["Temp"] ??
      headerMap["Temperature"] ??
      headerMap["Temp F"] ??
      headerMap["Temp(F)"] ??
      headerMap["Temp °F"] ??
      headerMap["Temp (F)"];

    const timeHeader = headerMap["Timepoint"];
    const sgHeader = headerMap["SG"];
    const colorHeader = headerMap["Color"];
    const beerHeader = headerMap["Beer"];
    const commentHeader = headerMap["Comment"];

    const readings = table.rows
      .map((row: any) => {
        const cols = row.c;

        // Skip rows without a real Timepoint
        if (!cols[timeHeader] || !cols[timeHeader].f) return null;

        return {
          time: cols[timeHeader].f || "",
          gravity: cols[sgHeader]?.f || cols[sgHeader]?.v || "",
          temperature:
            (tempHeader !== undefined &&
              (cols[tempHeader]?.f || cols[tempHeader]?.v)) ||
            "",
          color: cols[colorHeader]?.v || "",
          beer: cols[beerHeader]?.v || "",
          comment: cols[commentHeader]?.v || ""
        };
      })
      .filter(Boolean);

    return NextResponse.json({ readings });
  } catch (e) {
    return NextResponse.json(
      { error: "Unable to load readings. Check the URL and sharing settings." },
      { status: 500 }
    );
  }
}
