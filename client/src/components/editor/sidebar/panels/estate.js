"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addTextToCanvas, addImageToCanvas } from "@/fabric/fabric-utils";
import { useEditorStore } from "@/store";
import { supabase } from "@/integrations/supabase/client";

function EstatePanel() {
  const { canvas } = useEditorStore();
  const [estateId, setEstateId] = useState("");
  const [estate, setEstate] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const callOnOffice = async (action, body) => {
    const { data, error } = await supabase.functions.invoke("onoffice-api", { body: { action, ...body } });
    if (error) throw error;
    return data;
  };

  const loadEstate = async () => {
    if (!estateId) return;
    setLoading(true);
    try {
      const estates = await callOnOffice("getEstates", { parameters: { estateId } });
      const found = Array.isArray(estates?.response?.results)
        ? estates.response.results[0]?.data?.records?.[0]
        : estates?.[0];
      setEstate(found || null);
      const imgs = await callOnOffice("getEstateImages", { estateId: Number(estateId) });
      const normalized = Array.isArray(imgs)
        ? imgs
        : imgs?.response?.results?.[0]?.data?.records || [];
      setImages(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const insertField = async (fieldKey) => {
    if (!canvas || !estate) return;
    const value = estate.elements?.[fieldKey];
    if (!value) return;
    await addTextToCanvas(canvas, String(value), { fontSize: 28 });
  };

  const insertImageByType = async (type) => {
    if (!canvas || !images?.length) return;
    const img = images.find((i) => i.elements?.type === type) || images[0];
    const url = img?.elements?.imageUrl || img?.url;
    if (!url) return;
    await addImageToCanvas(canvas, url);
  };

  const commonFields = [
    { key: "objekttitel", label: "Titel" },
    { key: "ort", label: "Ort" },
    { key: "kaufpreis", label: "Kaufpreis" },
    { key: "wohnflaeche", label: "Wohnfläche" },
    { key: "zimmer", label: "Zimmer" },
    { key: "baujahr", label: "Baujahr" },
  ];

  const imageTypes = ["Titelbild", "Foto", "Grundriss"];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>Estate ID</Label>
          <Input value={estateId} onChange={(e) => setEstateId(e.target.value)} placeholder="e.g. 27" />
          <Button onClick={loadEstate} disabled={!estateId || loading} className="w-full">
            {loading ? "Loading..." : "Load estate"}
          </Button>
        </div>

        {estate && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">Felder einfügen</div>
            {commonFields.map((f) => (
              <Button key={f.key} variant="outline" className="w-full justify-start" onClick={() => insertField(f.key)}>
                {f.label}
              </Button>
            ))}

            <div className="pt-2">
              <div className="text-sm text-muted-foreground mb-2">Bildtyp einfügen</div>
              <Select onValueChange={(v) => insertImageByType(v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Bildtyp wählen" /></SelectTrigger>
                <SelectContent>
                  {imageTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EstatePanel;


