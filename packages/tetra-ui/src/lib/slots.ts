import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";

type Listener = () => void;

export type SlotRegistry<Name extends string = string> = {
  delete: (name: Name) => void;
  get: (name: Name) => ReactNode;
  has: (name: Name) => boolean;
  set: (name: Name, node: ReactNode) => void;
  subscribe: (name: Name, listener: Listener) => () => void;
  subscribePresence: (name: Name, listener: Listener) => () => void;
};

type FillProps<Name extends string> = {
  name: Name;
  children?: ReactNode;
  passthrough?: boolean;
};

type OutletProps<Name extends string> = {
  name: Name;
};

type ProviderProps = {
  children: ReactNode;
};

const notify = (listeners: Set<Listener> | undefined) => {
  if (!listeners) {
    return;
  }

  for (const listener of listeners) {
    listener();
  }
};

export const createSlotRegistry = <
  Name extends string = string,
>(): SlotRegistry<Name> => {
  const nodes = new Map<Name, ReactNode>();
  const nodeListeners = new Map<Name, Set<Listener>>();
  const presenceListeners = new Map<Name, Set<Listener>>();

  const getListeners = (map: Map<Name, Set<Listener>>, name: Name) => {
    let listeners = map.get(name);
    if (!listeners) {
      listeners = new Set();
      map.set(name, listeners);
    }
    return listeners;
  };

  return {
    delete: (name) => {
      if (!nodes.has(name)) {
        return;
      }

      nodes.delete(name);
      notify(nodeListeners.get(name));
      notify(presenceListeners.get(name));
    },
    get: (name) => nodes.get(name) ?? null,
    has: (name) => nodes.has(name),
    set: (name, node) => {
      const existed = nodes.has(name);
      if (existed && Object.is(nodes.get(name), node)) {
        return;
      }

      nodes.set(name, node);
      notify(nodeListeners.get(name));
      if (!existed) {
        notify(presenceListeners.get(name));
      }
    },
    subscribe: (name, listener) => {
      const listeners = getListeners(nodeListeners, name);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    subscribePresence: (name, listener) => {
      const listeners = getListeners(presenceListeners, name);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export const createSlots = <Name extends string = string>(options?: {
  errorMessage?: string;
}) => {
  const SlotsContext = createContext<SlotRegistry<Name> | null>(null);
  const errorMessage =
    options?.errorMessage ?? "Slot components must be rendered inside Provider";

  const useRegistry = () => {
    const registry = useContext(SlotsContext);
    if (!registry) {
      throw new Error(errorMessage);
    }
    return registry;
  };

  const Provider = ({ children }: ProviderProps) => {
    const [registry] = useState(() => createSlotRegistry<Name>());
    return createElement(SlotsContext.Provider, { value: registry }, children);
  };

  const Fill = ({ name, children, passthrough = false }: FillProps<Name>) => {
    const registry = useRegistry();

    useLayoutEffect(() => {
      registry.set(name, children);
      return () => {
        registry.delete(name);
      };
    }, [children, name, registry]);

    return passthrough ? children : null;
  };

  const useSlot = (name: Name) => {
    const registry = useRegistry();
    return useSyncExternalStore(
      (onStoreChange) => registry.subscribe(name, onStoreChange),
      () => registry.get(name),
      () => registry.get(name)
    );
  };

  const Outlet = ({ name }: OutletProps<Name>) => useSlot(name);

  const useHasSlot = (name: Name) => {
    const registry = useRegistry();
    return useSyncExternalStore(
      (onStoreChange) => registry.subscribePresence(name, onStoreChange),
      () => registry.has(name),
      () => registry.has(name)
    );
  };

  Provider.displayName = "SlotProvider";
  Fill.displayName = "SlotFill";
  Outlet.displayName = "SlotOutlet";

  return {
    Fill,
    Outlet,
    Provider,
    useHasSlot,
    useRegistry,
    useSlot,
  };
};
