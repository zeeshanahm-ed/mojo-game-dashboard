import { Dispatch, ReactNode, SetStateAction, createContext, useContext,  useMemo, useState } from 'react';

interface IProps {
  children: ReactNode;
}
interface HeaderContextType {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  back?: () => void;
  setBack: Dispatch<SetStateAction<(() => void) | undefined>>;
  assignedBy?: string;
  setAssignedBy: Dispatch<SetStateAction<string | undefined>>;
  updatedBy?: string;
  setUpdatedBy: Dispatch<SetStateAction<string | undefined>>;
  updatedDate?: Date;
  setUpdatedDate: Dispatch<SetStateAction<Date | undefined>>;
  editInfo?: string;
  setEditInfo: Dispatch<SetStateAction<string | undefined>>;
  showUpdateButton?: boolean;
  setShowUpdateButton: Dispatch<SetStateAction<boolean>>;
}

const HeaderContext = createContext<HeaderContextType>({
  title: '',
  setTitle: () => {},
  setBack: () => {},
  setAssignedBy: () => {},
  setUpdatedBy: () => {},
  setUpdatedDate: () => {},
  setEditInfo: () => {},
  setShowUpdateButton: () => {},
});

export const useHeaderProps = () => useContext(HeaderContext);

export function HeaderPropsProvider({ children }: IProps) {
  const [title, setTitle] = useState('');
  const [back, setBack] = useState<() => void>();
  const [assignedBy, setAssignedBy] = useState<string>();
  const [updatedBy, setUpdatedBy] = useState<string>();
  const [updatedDate, setUpdatedDate] = useState<Date>();
  const [editInfo, setEditInfo] = useState<string>();
  const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
  // const [user, setUser] = useState<string>();

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   // if (storedUser) {
  //   //   setUser(storedUser); 
  //   // }
  // }, []);
  const value = useMemo(
    () => ({
      title,
      setTitle,
      back,
      setBack,
      assignedBy,
      setAssignedBy,
      updatedBy,
      setUpdatedBy,
      updatedDate,
      setUpdatedDate,
      editInfo,
      setEditInfo,
      showUpdateButton,
      setShowUpdateButton,
    }),
    [title, back, assignedBy, updatedBy, updatedDate, editInfo, showUpdateButton]
  );

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}
