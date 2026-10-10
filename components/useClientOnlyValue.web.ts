import React from 'react';

// `useEffect` is not invoked during server rendering, meaning
// we can use this to determine if we're on the server or not.
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  const [value, setValue] = React.useState<S | C>(server);
  React.useEffect(() => {
    // Intentional hydration switch: server placeholder → client value after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Expo template pattern
    setValue(client);
  }, [client]);

  return value;
}
