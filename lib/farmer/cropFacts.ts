// General agronomic facts, not field-specific measurements or model outputs.
export const cropFacts: Record<string, { water: string; rotation: string; sources: { label: string; url: string }[] }> = {
  maize: {
    water: "Maize needs enough water throughout the season. A dry spell around flowering can reduce the harvest, so the timing of rain matters as much as the annual total.",
    rotation: "Changing crops between seasons can help manage weeds and pests. Consider a legume such as beans in another season where it fits your farm.",
    sources: [
      { label: "FAO: maize and water stress", url: "https://www.fao.org/4/10025e/10025e00.htm" },
      { label: "FAO: crop rotation", url: "https://www.fao.org/4/x4799e/x4799e.pdf" },
    ],
  },
  "common beans": {
    water: "Beans also need water during their growing season; dry spells can affect them. Check when rain is expected and what water you can provide.",
    rotation: "Beans are legumes. With suitable soil bacteria, they can fix nitrogen from the air; some nitrogen in crop residues may benefit a later crop. The benefit varies with soil, harvest and residue management.",
    sources: [
      { label: "FAO: crop water needs", url: "https://www.fao.org/4/s2022e/s2022e07.htm" },
      { label: "FAO: legumes in rotations", url: "https://www.fao.org/fileadmin/templates/nr/sustainability_pathways/docs/Compilation_techniques_organic_agriculture_rev.pdf" },
    ],
  },
};
