import { useCallback, useRef, useState } from "react";
import { useRete } from "rete-react-plugin";
import { createEditor, screenToEditorCoords, type EditorAPI } from "./editor";
import { generateCode } from "./codegen";
import { NodePalette } from "./components/NodePalette";
import { Toolbar } from "./components/Toolbar";
import { CodePreviewModal } from "./components/CodePreviewModal";

export const StrategyBuilder = () => {
  const editorApiRef = useRef<EditorAPI | null>(null);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const create = useCallback(async (el: HTMLElement) => {
    const api = await createEditor(el);
    editorApiRef.current = api;
    return api;
  }, []);

  const [containerRef] = useRete(create);

  const handleAddNode = useCallback(
    async (nodeType: string) => {
      const api = editorApiRef.current;
      if (!api) return;
      // Add at a slightly random position near center
      const x = 300 + Math.random() * 200;
      const y = 100 + Math.random() * 200;
      await api.addNode(nodeType, { x, y });
    },
    []
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const api = editorApiRef.current;
      if (!api) return;

      const nodeType = e.dataTransfer.getData("application/rete-node-type");
      if (!nodeType) return;

      const pos = screenToEditorCoords(api.area, e.clientX, e.clientY);
      await api.addNode(nodeType, pos);
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleAutoArrange = useCallback(async () => {
    await editorApiRef.current?.autoArrange();
  }, []);

  const handleZoomToFit = useCallback(async () => {
    await editorApiRef.current?.zoomToFit();
  }, []);

  const handleClear = useCallback(async () => {
    await editorApiRef.current?.clear();
  }, []);

  const handleGenerateCode = useCallback(() => {
    const api = editorApiRef.current;
    if (!api) return;
    const code = generateCode(api.editor);
    setGeneratedCode(code);
    setCodeModalOpen(true);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <NodePalette onAddNode={handleAddNode} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Toolbar
          onAutoArrange={handleAutoArrange}
          onGenerateCode={handleGenerateCode}
          onClear={handleClear}
          onZoomToFit={handleZoomToFit}
        />

        <div
          ref={containerRef}
          style={{ flex: 1, background: "#0f172a" }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      </div>

      <CodePreviewModal
        opened={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        code={generatedCode}
      />
    </div>
  );
};
