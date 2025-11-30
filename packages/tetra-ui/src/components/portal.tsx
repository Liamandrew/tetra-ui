import { Fragment, useEffect, useSyncExternalStore } from "react";
import { Platform } from "react-native";
import { FullWindowOverlay } from "react-native-screens";

// Constants
const DEFAULT_PORTAL_HOST = "TETRA_UI_DEFAULT_HOST_NAME";

// Types
type PortalHostProps = {
  name?: string;
};

type PortalProps = {
  name: string;
  hostName?: string;
  children: React.ReactNode;
};

type PortalMap = Map<string, React.ReactNode>;

type PortalHostMap = Map<string, PortalMap>;

type PortalListener = () => void;

// Components
export const PortalOverlay =
  Platform.OS === "ios" ? FullWindowOverlay : Fragment;

export const PortalHost = ({ name = DEFAULT_PORTAL_HOST }: PortalHostProps) => {
  const map = usePortalMap();
  const portal = map.get(name) ?? new Map<string, React.ReactNode>();

  if (portal.size === 0) {
    return null;
  }

  return <>{Array.from(portal.values())}</>;
};

export const Portal = ({
  name,
  hostName = DEFAULT_PORTAL_HOST,
  children,
}: PortalProps) => {
  useEffect(() => {
    updatePortal(hostName, name, children);
  }, [hostName, name, children]);

  useEffect(() => {
    return () => {
      removePortal(hostName, name);
    };
  }, [hostName, name]);

  return null;
};

// Hooks
const usePortalMap = () => {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    () => portalMap
  );
};

// Utils
let portalMap: PortalHostMap = new Map<string, PortalMap>().set(
  DEFAULT_PORTAL_HOST,
  new Map<string, React.ReactNode>()
);

const listeners = new Set<PortalListener>();

const notifyListeners = () => {
  for (const listener of listeners) {
    listener();
  }
};

const updatePortal = (
  hostName: string,
  name: string,
  content: React.ReactNode
) => {
  const next = new Map(portalMap);
  const portal = next.get(hostName) ?? new Map<string, React.ReactNode>();
  const updatedPortal = new Map(portal);
  updatedPortal.set(name, content);
  next.set(hostName, updatedPortal);
  portalMap = next;
  notifyListeners();
};

const removePortal = (hostName: string, name: string) => {
  const next = new Map(portalMap);
  const portal = next.get(hostName);
  if (portal) {
    const updatedPortal = new Map(portal);
    updatedPortal.delete(name);
    if (updatedPortal.size === 0) {
      next.delete(hostName);
    } else {
      next.set(hostName, updatedPortal);
    }
    portalMap = next;
    notifyListeners();
  }
};
