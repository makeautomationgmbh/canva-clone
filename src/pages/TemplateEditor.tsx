import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TemplateEditor as TemplateEditorComponent } from "@/components/sections/TemplateEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TemplateEditor = () => {
  const navigate = useNavigate();
  const [sampleEstateData] = useState({
    kaufpreis: "850.000 €",
    ort: "München",
    objektart: "Einfamilienhaus",
    zimmeranzahl: "5",
    wohnflaeche: "180 m²",
    grundstuecksflaeche: "500 m²",
    baujahr: "2020",
    images: [
      {
        id: 431,
        type: "file",
        elements: {
          type: "Titelbild",
          title: "Haus Fassade",
          imageUrl: "https://crm-beta.onoffice.de/smart20/Objekte/makeautomation-test/27/Titelbild_431.jpg",
          originalname: "Foto_465.jpg"
        }
      },
      {
        id: 435,
        type: "file", 
        elements: {
          type: "Foto",
          title: "Erdgeschoss Wohn-/ Essbereich",
          imageUrl: "https://crm-beta.onoffice.de/smart20/Objekte/makeautomation-test/27/Foto_435.jpg",
          originalname: "Foto_431.jpg"
        }
      },
      {
        id: 447,
        type: "file",
        elements: {
          type: "Grundriss", 
          title: "Grundriss (optimiert)",
          imageUrl: "https://crm-beta.onoffice.de/smart20/Objekte/makeautomation-test/27/Foto_447.jpg",
          originalname: "Grundriss_222.jpg"
        }
      }
    ]
  });

  const handleSaveTemplate = (templateData: any) => {
    console.log("Template saved:", templateData);
    // Here you would typically save to your backend/database
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b">
        <div className="container py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            <h1 className="text-2xl font-bold">Template Editor</h1>
          </div>
        </div>
      </div>
      <TemplateEditorComponent
        estateData={sampleEstateData}
        onSaveTemplate={handleSaveTemplate}
      />
    </div>
  );
};

export default TemplateEditor;