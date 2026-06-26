import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, Trash2, X } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { cn } from '@/lib/utils';
import type { Asset } from '@/types/canvas';

export function AssetsPanel() {
  const { assets, addAsset, deleteAsset, addElement } = useEditorStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const assetList = Object.values(assets);
  const filteredAssets = assetList.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const src = reader.result as string;
        const img = new window.Image();

        img.onload = () => {
          const asset: Asset = {
            id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: file.type.startsWith('image/svg') ? 'svg' : 'image',
            src,
            thumbnail: src,
            width: img.width,
            height: img.height,
            tags: [],
            category: 'uploads',
            uploadedAt: Date.now(),
            fileSize: file.size,
          };

          addAsset(asset);
        };

        img.src = src;
      };

      reader.readAsDataURL(file);
    });
  }, [addAsset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
    },
    multiple: true,
  });

  const handleAddToCanvas = (asset: Asset) => {
    // Calculate appropriate size for canvas
    const maxSize = 400;
    let width = asset.width;
    let height = asset.height;

    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width *= ratio;
      height *= ratio;
    }

    addElement({
      id: `image_${Date.now()}`,
      type: 'image',
      name: asset.name,
      src: asset.src,
      x: 100,
      y: 100,
      width,
      height,
      originalWidth: asset.width,
      originalHeight: asset.height,
      cropX: 0,
      cropY: 0,
      cropWidth: asset.width,
      cropHeight: asset.height,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: Date.now(),
      timestamp: Date.now(),
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Assets</h3>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          'm-4 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            {isDragActive ? 'Drop images here' : 'Upload images'}
          </p>
          <p className="text-xs text-slate-500">
            PNG, JPG, SVG up to 10MB
          </p>
        </div>
      </div>

      {/* Assets Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {assetList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500 mb-2">No assets yet</p>
              <p className="text-xs text-slate-400">
                Upload images to get started
              </p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No assets found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => handleAddToCanvas(asset)}
                >
                  <img
                    src={asset.thumbnail || asset.src}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCanvas(asset);
                      }}
                    >
                      Add to Canvas
                    </Button>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAsset(asset.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  {/* Asset Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white truncate font-medium">
                      {asset.name}
                    </p>
                    <p className="text-[10px] text-white/80">
                      {asset.width} × {asset.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      {assetList.length > 0 && (
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>{assetList.length} asset{assetList.length !== 1 ? 's' : ''}</span>
            <span>
              {(assetList.reduce((sum, a) => sum + a.fileSize, 0) / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetsPanel;
