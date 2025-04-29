"use client";
import { Button } from "@/components/ui/button";
import { PlaylistsCreateModal } from "@/modules/playlists/ui/components/playlists-create-model";
import { PlaylistsVideosSection } from "@/modules/playlists/ui/sections/playlists-section";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function PlaylistsView() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div className="max-w-[2400px] mx-auto px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistsCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Collections you have created
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistsVideosSection />
    </div>
  );
}
