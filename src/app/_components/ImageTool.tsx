"use client";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";

export default function ImageTools() {
  return (
    <div className="flex justify-center">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Image analysis</TabsTrigger>
          <TabsTrigger value="password">Ingredient recognition</TabsTrigger>
          <TabsTrigger value="password">Image creator</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
