import {
  createContext,
  Dispatch,
  FC,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from 'react';

type AlertContextActions =
  | 'OPEN_MODAL'
  | 'CLOSE_MODAL'
  | 'OPEN_NOTIFICATION'
  | 'CLOSE_NOTIFICATION';

interface AlertContextState {
  showModal: boolean;
  showNotification: boolean;
}

const initialState: AlertContextState = {
  showModal: false,
  showNotification: false,
};

const alertContextReducer: Reducer<AlertContextState, AlertContextActions> = (
  _,
  action
) => {
  switch (action) {
    case 'OPEN_MODAL':
      return {
        showNotification: false,
        showModal: true,
      };
    case 'CLOSE_MODAL':
      return {
        showNotification: false,
        showModal: false,
      };
    case 'OPEN_NOTIFICATION':
      return {
        showNotification: true,
        showModal: false,
      };
    case 'CLOSE_NOTIFICATION':
      return {
        showNotification: false,
        showModal: false,
      };
  }
};

interface AlertContextProps {
  state: AlertContextState;
  dispatch: Dispatch<AlertContextActions>;
}

const TIMEOUT = 5000;

const AlertContext = createContext<AlertContextProps>({
  state: initialState,
  dispatch: () => {},
});

const AlertContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(alertContextReducer, initialState);

  useEffect(() => {
    if (state.showModal) {
      dispatch('CLOSE_NOTIFICATION');
      setTimeout(() => dispatch('CLOSE_MODAL'), TIMEOUT);
    }
  }, [state.showModal]);

  useEffect(() => {
    if (state.showNotification) {
      dispatch('CLOSE_MODAL');
      setTimeout(() => dispatch('CLOSE_NOTIFICATION'), TIMEOUT);
    }
  }, [state.showNotification]);

  return (
    <AlertContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export function useAlertContext() {
  return useContext(AlertContext);
}

export default AlertContextProvider;
