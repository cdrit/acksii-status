// scripts/main.js
Hooks.on("init", async () => {
  console.log("🔄 Your Custom Status Effects | Loading DCE JSON...");

  try {
    const jsonPath = "modules/your-custom-statuses/effects/my-dce-effects.json";

    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const dceData = await response.json();

    const statusArray = [];

    const folders = Array.isArray(dceData) ? dceData : [dceData];

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

        // Extract useful data from DCE export
        const name = effectEntry.name;
        const img = effectEntry.img || "icons/svg/aura.svg";
        const tint = effectEntry.tint || effectEntry.effect?.tint || "#ffffff";
        const description = effectEntry.description 
                         || effectEntry.effect?.description 
                         || effectEntry.notes 
                         || "";

        statusArray.push({
          id: id,
          name: name,
          img: img,
          tint: tint,                    // ← Color for HUD icon
          hud: true,
          order: order++,
          description: description,      // ← Shown in tooltip / effects panel
          
          // Optional but recommended for better integration
          statuses: [id],
          flags: {
            "dfreds-convenient-effects": {
              name: name
            }
          }
        });
      }
    }

    if (statusArray.length === 0) {
      console.warn("⚠️ No effects found in DCE JSON");
      return;
    }

    CONFIG.statusEffects = statusArray;

    console.log(`✅ Successfully loaded ${statusArray.length} custom status effects with colors & descriptions`);

  } catch (error) {
    console.error("❌ Failed to load DCE JSON:", error);
    ui.notifications.error("Custom Status Effects failed to load JSON. Check console.");
  }
});
