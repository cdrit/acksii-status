// scripts/main.js
Hooks.on("init", async () => {
  console.log("🔄 Acksii Status Effects | Loading custom effects...");

  try {
    const jsonPath = "modules/acksii-status/effects/my-effects.json";

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

        statusArray.push({
          id: id,
          name: name,
          img: img,
          tint: tint,
          hud: true,
          order: order++,
          description: description,
          statuses: [id]
        });
      }
    }

    if (statusArray.length === 0) {
      console.warn("⚠️ No effects found in the JSON file");
      return;
    }

    CONFIG.statusEffects = statusArray;

    console.log(`✅ Successfully loaded ${statusArray.length} custom status effects`);

  } catch (error) {
    console.error("❌ Failed to load effects JSON:", error);
    ui.notifications.error("Acksii Status Effects failed to load the JSON file. Check console (F12).");
  }
});
