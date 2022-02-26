import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

interface AlertContextState {
  openModal: boolean;
  openNotification: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setOpenNotification: Dispatch<SetStateAction<boolean>>;
}

export const AlertContext = createContext<AlertContextState>({
  openModal: false,
  openNotification: false,
  setOpenModal: () => {},
  setOpenNotification: () => {},
});

const TIMEOUT = 5000;

const AlertContextProvider: FC = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  useEffect(() => {
    if (openModal) {
      setOpenNotification(false);
      setTimeout(() => setOpenModal(false), TIMEOUT);
    }
  }, [openModal, setOpenModal, setOpenNotification]);

  useEffect(() => {
    if (openNotification) {
      setOpenModal(false);
      setTimeout(() => setOpenNotification(false), TIMEOUT);
    }
  }, [openNotification, setOpenNotification, setOpenModal]);

  return (
    <AlertContext.Provider
      value={{
        openModal,
        openNotification,
        setOpenModal,
        setOpenNotification,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContextProvider;
