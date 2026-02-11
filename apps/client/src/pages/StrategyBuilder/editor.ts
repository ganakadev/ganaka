import { NodeEditor } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets as ReactPresets } from "rete-react-plugin";
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
} from "rete-auto-arrange-plugin";
import { createRoot } from "react-dom/client";

import type { Schemes, AreaExtra } from "./types";
import { BaseNode, canConnect } from "./types";
import { CustomNodeComponentWithProvider } from "./components/CustomNode";
import { CustomSocket } from "./components/CustomSocket";
import { NODE_REGISTRY } from "./nodes";

export interface EditorAPI {
  editor: NodeEditor<Schemes>;
  area: AreaPlugin<Schemes, AreaExtra>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arrange: AutoArrangePlugin<any>;
  addNode: (nodeType: string, position?: { x: number; y: number }) => Promise<BaseNode | null>;
  removeNode: (nodeId: string) => Promise<void>;
  clear: () => Promise<void>;
  autoArrange: () => Promise<void>;
  zoomToFit: () => Promise<void>;
  destroy: () => void;
}

export async function createEditor(
  container: HTMLElement
): Promise<EditorAPI> {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  // Connection plugin with socket compatibility validation
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  connection.addPreset(ConnectionPresets.classic.setup());

  // React rendering with custom node and socket components
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  render.addPreset(
    ReactPresets.classic.setup({
      customize: {
        node() {
          return CustomNodeComponentWithProvider as any;
        },
        socket() {
          return CustomSocket as any;
        },
      },
    })
  );

  // Auto-arrange using elkjs (uses `any` because AutoArrangePlugin expects
  // nodes with width/height which our runtime BaseNode has but ClassicScheme doesn't declare)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arrange = new AutoArrangePlugin<any>();
  arrange.addPreset(ArrangePresets.classic.setup());

  // Wire plugins together
  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(arrange);

  // Enable node selection
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  // Connection validation: only allow compatible socket types
  editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { data } = context;
      const sourceNode = editor.getNode(data.source);
      const targetNode = editor.getNode(data.target);

      if (!sourceNode || !targetNode) return undefined;

      const sourceOutput = sourceNode.outputs[data.sourceOutput];
      const targetInput = targetNode.inputs[data.targetInput];

      if (!sourceOutput || !targetInput) return undefined;

      if (!canConnect(sourceOutput.socket, targetInput.socket)) {
        return undefined; // Block incompatible connections
      }
    }
    return context;
  });

  // ── API ──────────────────────────────────────────────────────────

  const addNode = async (
    nodeType: string,
    position?: { x: number; y: number }
  ) => {
    const entry = NODE_REGISTRY[nodeType];
    if (!entry) return null;

    const node = entry.create();
    await editor.addNode(node);

    if (position) {
      await area.translate(node.id, position);
    }

    return node;
  };

  const removeNode = async (nodeId: string) => {
    // Remove all connections to/from this node first
    const connections = editor.getConnections().filter(
      (c) => c.source === nodeId || c.target === nodeId
    );
    for (const conn of connections) {
      await editor.removeConnection(conn.id);
    }
    await editor.removeNode(nodeId);
  };

  const clear = async () => {
    const nodes = editor.getNodes();
    for (const node of nodes) {
      await removeNode(node.id);
    }
  };

  const autoArrange = async () => {
    await arrange.layout();
    AreaExtensions.zoomAt(area, editor.getNodes());
  };

  const zoomToFit = async () => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  };

  const destroy = () => {
    area.destroy();
  };

  return {
    editor,
    area,
    arrange,
    addNode,
    removeNode,
    clear,
    autoArrange,
    zoomToFit,
    destroy,
  };
}

// Helper: convert screen coordinates to editor coordinates
export function screenToEditorCoords(
  area: AreaPlugin<Schemes, AreaExtra>,
  screenX: number,
  screenY: number
): { x: number; y: number } {
  const container = area.container;
  const rect = container.getBoundingClientRect();
  const { transform } = area.area;

  // Convert screen pos to container-relative pos, then to editor coords
  const x = (screenX - rect.left - transform.x) / transform.k;
  const y = (screenY - rect.top - transform.y) / transform.k;

  return { x, y };
}
