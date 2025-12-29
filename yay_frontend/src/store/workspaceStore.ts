import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BSPChatNode, SplitDirection } from '../types/BSPChatNode';

type WorkspaceStore = {
  rootNode: BSPChatNode;
  activePaneId: string | null;
  paneHistory: string[]; // Most recently used at end
  actions: {
    // set node with id nodeId to display channel with channelId
    setChannel: (nodeId: string, channelId: number | null) => void;
    // turn a pane into a split where one split is an empty pane
    splitNode: (nodeId: string, direction: SplitDirection) => void;
    removeNode: (nodeId: string) => void;
    setActivePane: (nodeId: string) => void;
  };
};

function generateId() {
  return crypto.randomUUID();
}

// transform the root after applying the update function on the target node
function updateTree(
  parent: BSPChatNode,
  targetNodeId: string,
  updateFn: (node: BSPChatNode) => BSPChatNode,
): BSPChatNode {
  // base case: transform the node
  if (parent.id === targetNodeId) {
    return updateFn(parent);
  }

  if (parent.type === 'split') {
    return {
      ...parent,
      left: updateTree(parent.left, targetNodeId, updateFn),
      right: updateTree(parent.right, targetNodeId, updateFn),
    };
  }

  return parent;
}

// given a node, return the node without the child with id nodeId
function removeNodeFromTree(
  parent: BSPChatNode,
  targetNodeId: string,
): BSPChatNode | null {
  // base case: found targeted node
  if (parent.id === targetNodeId) {
    return null;
  }

  if (parent.type === 'split') {
    // only one child can be null since each child has a unique id
    const newLeft = removeNodeFromTree(parent.left, targetNodeId);
    const newRight = removeNodeFromTree(parent.right, targetNodeId);

    // if you kill a subtree, promote the other sibling and give it the parent's
    //  ID to maintain tree position identity
    if (newLeft === null) {
      return { ...newRight!, id: parent.id };
    }
    if (newRight === null) {
      return { ...newLeft!, id: parent.id };
    }

    // create a new object to use as the new state
    // does not mutate old state
    if (newLeft !== parent.left || newRight !== parent.right) {
      return { ...parent, left: newLeft, right: newRight };
    }
  }

  return parent;
}

// Get all pane IDs from a tree
function getAllPaneIds(node: BSPChatNode): string[] {
  if (node.type === 'pane') {
    return [node.id];
  }
  return [...getAllPaneIds(node.left), ...getAllPaneIds(node.right)];
}

// Find the first pane in the tree (DFS left-first)
function findFirstPaneId(node: BSPChatNode): string {
  if (node.type === 'pane') {
    return node.id;
  }
  return findFirstPaneId(node.left);
}

const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    set => ({
      rootNode: {
        type: 'pane',
        id: 'root',
        channelId: null,
      },
      activePaneId: 'root',
      paneHistory: ['root'],
      actions: {
        setChannel: (nodeId, channelId) =>
          set(state => ({
            rootNode: updateTree(state.rootNode, nodeId, node =>
              node.type === 'pane' ? { ...node, channelId } : node,
            ),
          })),
        splitNode: (nodeId, direction) =>
          set(state => {
            const originalPaneId = generateId();

            return {
              rootNode: updateTree(state.rootNode, nodeId, node => {
                if (node.type === 'split') {
                  return node;
                }

                const originalPane: BSPChatNode = {
                  ...node,
                  id: originalPaneId,
                };

                const newPane: BSPChatNode = {
                  type: 'pane',
                  id: generateId(),
                  channelId: null,
                };

                const splitNorthOrWest =
                  direction === 'north' || direction === 'west';

                return {
                  type: 'split',
                  id: node.id,
                  direction,
                  left: splitNorthOrWest ? newPane : originalPane,
                  right: splitNorthOrWest ? originalPane : newPane,
                };
              }),
              activePaneId:
                state.activePaneId === nodeId
                  ? originalPaneId
                  : state.activePaneId,
            };
          }),
        removeNode: nodeId =>
          set(state => {
            const newRoot = removeNodeFromTree(state.rootNode, nodeId);
            const finalRoot = newRoot || {
              type: 'pane',
              id: 'root',
              channelId: null,
            };

            // Get most recent pane that still exists
            const remainingPanes = getAllPaneIds(finalRoot);
            const newHistory = state.paneHistory.filter(id => id !== nodeId);
            const lastActivePane = [...newHistory]
              .reverse()
              .find(id => remainingPanes.includes(id));

            return {
              rootNode: finalRoot,
              activePaneId: lastActivePane || findFirstPaneId(finalRoot),
              paneHistory: newHistory,
            };
          }),
        setActivePane: nodeId =>
          set(state => ({
            activePaneId: nodeId,
            paneHistory: [
              ...state.paneHistory.filter(id => id !== nodeId),
              nodeId,
            ],
          })),
      },
    }),
    {
      name: 'workspace-store',
      version: 1, // Increment this to invalidate old corrupted state
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        rootNode: state.rootNode,
        activePaneId: state.activePaneId,
        paneHistory: state.paneHistory,
      }),
    },
  ),
);

export const useWorkspaceActions = () =>
  useWorkspaceStore(state => state.actions);

export const useWorkspaceRoot = () =>
  useWorkspaceStore(state => state.rootNode);

export const useActivePaneId = () =>
  useWorkspaceStore(state => state.activePaneId);

// Non-reactive getter for use in event handlers
export const getActivePaneId = () => useWorkspaceStore.getState().activePaneId;

export const useIsActivePane = (nodeId: string) =>
  useWorkspaceStore(state => state.activePaneId === nodeId);
