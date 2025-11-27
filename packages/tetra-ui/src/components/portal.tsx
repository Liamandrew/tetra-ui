import { useEffect, useState } from "react";

// Constants
const DEFAULT_PORTAL_HOST = "TETRA_UI_DEFAULT_HOST_NAME";

// Types
type PortalMap = Map<string, React.ReactNode>;
type PortalHostMap = Map<string, PortalMap>;

// Components
export const PortalHost = ({
  name = DEFAULT_PORTAL_HOST,
}: {
  name?: string;
}) => {
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
}: {
  name: string;
  hostName?: string;
  children: React.ReactNode;
}) => {
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
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => {
      forceUpdate({});
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return portalMap;
};

// Utils
let portalMap: PortalHostMap = new Map<string, PortalMap>().set(
  DEFAULT_PORTAL_HOST,
  new Map<string, React.ReactNode>()
);

type Listener = () => void;
const listeners = new Set<Listener>();

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
