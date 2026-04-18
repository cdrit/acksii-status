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

        const name = effectEntry.name;
        const img = effectEntry.img || "icons/svg/aura.svg";

        // Improved tint extraction (handles different DCE export structures)
        let tint = effectEntry.tint 
                || effectEntry.effect?.tint 
                || effectEntry.color 
                || "#ffffff";

        // Ensure tint is a valid hex color
        if (!tint.startsWith("#")) tint = "#" + tint.replace("#", "");

        const description = effectEntry.description 
                         || effectEntry.effect?.description 
                         || effectEntry.notes 
                         || "";

        statusArray.push({
          id: id,
          name: name,
          img: img,
          tint: tint,                    // ← This should color the HUD icons
          hud: true,
          order: order++,
          description: description,
          statuses: [id],

          // Helps with rendering and DFreds compatibility
          flags: {
            core: { statusId: id },
            "dfreds-convenient-effects": { name: name }
          }
        });
      }
    }

    if (statusArray.length === 0) {
      console.warn("⚠️ No effects found in DCE JSON");
      return;
    }

    CONFIG.statusEffects = statusArray;

    console.log(`✅ Loaded ${statusArray.length} custom status effects with tint & description`);

  } catch (error) {
    console.error("❌ Failed to load DCE JSON:", error);
    ui.notifications.error("Custom Status Effects failed to load JSON.");
  }
});
