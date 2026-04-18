// scripts/main.js
Hooks.on("init", async () => {
  console.log("🔄 ACKS II Status Effects | Loading custom effects...");

  try {
    const jsonPath = "modules/acksii-status/effects/acksii-effects.json";

    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    const statusArray = [];

    const folders = Array.isArray(data) ? data : [data];

    let order = 1;

    for (const folder of folders) {
      const effects = folder.effects || folder.children || [];

      for (const effectEntry of effects) {
        if (!effectEntry?.name) continue;

        const id = effectEntry.name
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        const name = effectEntry.name;
        const img = effectEntry.img || "icons/svg/aura.svg";
        const tint = effectEntry.tint || effectEntry.effect?.tint || "#ffffff";
        const description = effectEntry.description 
                         || effectEntry.effect?.description 
                         || effectEntry.notes 
                         || "";

        // Extract the full changes from the DCE Active Effect
        let changes = [];
        const aeData = effectEntry.effect || effectEntry;   // DCE sometimes nests the AE

        if (aeData?.changes && Array.isArray(aeData.changes)) {
          changes = aeData.changes;   // This is the important part for real mechanical changes
        }

        statusArray.push({
          id: id,
          name: name,
          img: img,
          tint: tint,
          hud: true,
          order: order++,
          description: description,
          statuses: [id],

          // Core fields that make the status apply real Active Effect changes
          changes: changes,                    // ← This applies the actual modifiers
          duration: aeData.duration || {},     // preserves duration if any
          flags: {
            core: { statusId: id },
            "dfreds-convenient-effects": {
              name: name
            }
          }
        });
      }
    }

    if (statusArray.length === 0) {
      console.warn("⚠️ No effects found in the JSON file");
      return;
    }

    CONFIG.statusEffects = statusArray;

    console.log(`✅ Successfully loaded ${statusArray.length} custom status effects with full Active Effect changes`);

  } catch (error) {
    console.error("❌ Failed to load effects JSON:", error);
    ui.notifications.error("ACKS II Status Effects failed to load the JSON file. Check console (F12).");
  }
});
