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

        statusArray.push({
          id: id,
          name: effectEntry.name,
          img: effectEntry.img || "icons/svg/aura.svg",
          hud: true,
          order: order++
        });
      }
    }

    if (statusArray.length === 0) {
      console.warn("⚠️ No effects found in DCE JSON");
      return;
    }

    // ←←← THIS IS THE IMPORTANT FIX
    CONFIG.statusEffects = statusArray;

    console.log(`✅ Successfully loaded ${statusArray.length} custom status effects`);

  } catch (error) {
    console.error("❌ Failed to load DCE JSON:", error);
    ui.notifications.error("Your Custom Status Effects module failed to load the JSON. Check console (F12).");
  }
});
