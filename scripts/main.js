// scripts/main.js
Hooks.on("init", async () => {
  console.log("🔄 Your Custom Status Effects | Loading DCE JSON...");

  try {
    // Change this filename if your JSON has a different name
    const jsonPath = "modules/your-custom-statuses/effects/my-dce-effects.json";

    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.status} ${response.statusText}`);
    }

    const dceData = await response.json();

    // Convert DCE export to CONFIG.statusEffects (hard replacement)
    const statusEffects = {};

    // DCE export is usually an array of folders (or a single folder object)
    const folders = Array.isArray(dceData) ? dceData : [dceData];

    let order = 1;

    for (const folder of folders) {
      // Effects can be in .effects or .children depending on export version
      const effects = folder.effects || folder.children || [];

      for (const effectEntry of effects) {
        if (!effectEntry?.name) continue;

        // Use a clean ID (same style DFreds uses internally)
        const id = effectEntry.name
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        // Get the icon and name (DCE usually puts the real data on the entry)
        const name = effectEntry.name;
        const img = effectEntry.img || "icons/svg/aura.svg"; // fallback

        statusEffects[id] = {
          id: id,
          name: name,
          img: img,
          hud: true,           // show in token HUD
          order: order++
          // You can add more fields here later if needed (e.g. description)
        };
      }
    }

    if (Object.keys(statusEffects).length === 0) {
      console.warn("⚠️ No status effects found in the DCE JSON file.");
      return;
    }

    // Hard replace all default status effects
    CONFIG.statusEffects = statusEffects;

    console.log(`✅ Successfully loaded ${Object.keys(statusEffects).length} custom status effects from DCE JSON`);

  } catch (error) {
    console.error("❌ Failed to load DCE effects JSON:", error);
    ui.notifications?.error("Your Custom Status Effects module could not load the DCE JSON file. Check the console (F12).");
  }
});
