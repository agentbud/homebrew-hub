import { NextResponse } from "next/server";

function extractSheetInfo(url: string) {
  const m = url.match(/spreadsheets\/d\/([^/]+).*?[?&]gid=(\d+)/);
  if (!m) return null;
  return { id: m[1], gid: m[2] };
}

function parseGvizJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const jsonStr = text.slice(start, end + 1);
  return JSON.parse(jsonStr);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  const info = extractSheetInfo(url);
  if (!info) {
    return NextResponse.json(
      { error: "Unable to parse sheet ID / gid from URL" },
      { status: 400 }
    );
  }

  const gvizUrl = `https://docs.google.com/spreadsheets/d/${info.id}/gviz/tq?tqx=out:json&gid=${info.gid}`;

  try {
    const res = await fetch(gvizUrl);
    const text = await res.text();
    const json = parseGvizJson(text);

    const table = json.table;
    const rows = table.rows;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ beers: [] });
    }

    // --- AUTO-DETECT BEER COLUMN ---
    let beerIdx = -1;
    let beerScore = 0;

    // --- AUTO-DETECT URL COLUMN ---
    let urlIdx = -1;
    let urlScore = 0;

    const colCount = table.cols.length;

    for (let col = 0; col < colCount; col++) {
      let bScore = 0;
      let uScore = 0;

      for (const row of rows) {
        const cell = row.c[col];
        if (!cell || !cell.v) continue;

        const val = String(cell.v).trim();

        // Beer name heuristic:
        // - Not a URL
        // - Not numeric
        // - Reasonable length
        if (
          val.length > 1 &&
          val.length < 50 &&
          !val.includes("http") &&
          isNaN(Number(val))
        ) {
          bScore++;
        }

        // URL heuristic:
        if (val.includes("docs.google.com/spreadsheets")) {
          uScore += 5; // strong signal
        } else if (val.includes("http")) {
          uScore++;
        }
      }

      if (bScore > beerScore) {
        beerScore = bScore;
        beerIdx = col;
      }

      if (uScore > urlScore) {
        urlScore = uScore;
        urlIdx = col;
      }
    }

    if (beerIdx === -1 || urlIdx === -1) {
      return NextResponse.json({ beers: [] });
    }

    const beers =
      rows
        .map((row: any) => {
          const cells = row.c;

          const name =
            beerIdx >= 0 && cells[beerIdx]?.v
              ? String(cells[beerIdx].v)
              : "";

          const link =
            urlIdx >= 0 && cells[urlIdx]?.v
              ? String(cells[urlIdx].v)
              : "";

          if (!name || !link) return null;

          return { name, url: link };
        })
        .filter(Boolean) || [];

    return NextResponse.json({ beers });
  } catch (e) {
    return NextResponse.json(
      { error: "Error parsing master sheet" },
      { status: 500 }
    );
  }
}
