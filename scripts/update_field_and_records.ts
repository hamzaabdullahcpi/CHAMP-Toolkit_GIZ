import dotenv from "dotenv";
dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

if (!baseId || !pat) {
  console.error("Missing AIRTABLE_BASE_ID or AIRTABLE_PAT in environment.");
  process.exit(1);
}

const tableId = "tbl2bHAk6dllt5Vs2"; // Key Resources
const fieldId = "fldC63OGDYKNDpgd7";

async function main() {
  console.log(`[Airtable] Updating field ${fieldId} in table ${tableId}...`);

  // 1. Rename field via Metadata API
  try {
    const metaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields/${fieldId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${pat}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "What you can learn / Why use this",
        description: "Contextual guidance: 'What you can learn: ...' for Peer Learning Examples, or 'Why use this: ...' for Tools."
      })
    });

    if (metaRes.ok) {
      console.log("✓ Successfully renamed field in Airtable to 'What you can learn / Why use this'");
    } else {
      const errText = await metaRes.text();
      console.warn("Notice when renaming field via Meta API (may already be renamed or schema permissions):", errText);
    }
  } catch (err: any) {
    console.warn("Notice: Meta API field rename encountered error:", err.message);
  }

  // 2. Fetch all records from Key Resources
  console.log(`[Airtable] Fetching records from Key Resources...`);
  let allRecords: any[] = [];
  let offset = "";
  do {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}${offset ? `?offset=${offset}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${pat}` } });
    if (!res.ok) {
      throw new Error(`Failed to fetch records: ${res.statusText}`);
    }
    const data: any = await res.json();
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset;
  } while (offset);

  console.log(`[Airtable] Fetched ${allRecords.length} records. Preparing updates...`);

  // 3. Prepare updates
  const updates: { id: string; fields: Record<string, string> }[] = [];

  for (const rec of allRecords) {
    const f = rec.fields || {};
    const title = f["Example Title"] || f["Title"] || "";
    const type = f["Type"] || "";
    const isTool =
      String(type).toLowerCase().includes("tool") ||
      /tool|toolkit|calculator|matrix|framework|simulator|portal|index|model|guide/i.test(title);

    const rawConn =
      f["What you can learn / Why use this"] ||
      f["Why see this / When to use this"] ||
      f["Why see this"] ||
      f["Why use this"] ||
      "";

    // Strip old prefixes
    const cleanBody = rawConn
      .replace(/^(?:what you can learn|why see this|why use this tool|why use this|when to use this)\s*[:\-]\s*/gi, "")
      .trim();

    let newConn = "";
    if (cleanBody) {
      newConn = isTool ? `Why use this: ${cleanBody}` : `What you can learn: ${cleanBody}`;
    } else {
      newConn = isTool
        ? `Why use this: Identify suitable tools, diagnostic checklists and frameworks to support this pathway.`
        : `What you can learn: See how national and subnational governments put this implementation pathway into practice.`;
    }

    if (rawConn !== newConn) {
      updates.push({
        id: rec.id,
        fields: {
          "What you can learn / Why use this": newConn
        }
      });
    }
  }

  console.log(`[Airtable] Need to update ${updates.length} records...`);

  // 4. Batch update records (10 at a time)
  for (let i = 0; i < updates.length; i += 10) {
    const batch = updates.slice(i, i + 10);
    const patchRes = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${pat}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        records: batch
      })
    });

    if (!patchRes.ok) {
      // If the field name 'What you can learn / Why use this' was not found, fallback to 'Why see this / When to use this'
      const fallbackBatch = batch.map(b => ({
        id: b.id,
        fields: {
          "Why see this / When to use this": b.fields["What you can learn / Why use this"]
        }
      }));
      const fallbackRes = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${pat}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          records: fallbackBatch
        })
      });
      if (!fallbackRes.ok) {
        const errText = await fallbackRes.text();
        console.error(`Batch update error at offset ${i}:`, errText);
      } else {
        console.log(`✓ Updated batch ${i / 10 + 1} (${batch.length} records) via fallback field name.`);
      }
    } else {
      console.log(`✓ Updated batch ${i / 10 + 1} (${batch.length} records) via 'What you can learn / Why use this'.`);
    }

    // Rate-limit throttle (200ms)
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log("[Airtable] Finished updating all records in Airtable!");
}

main().catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});
