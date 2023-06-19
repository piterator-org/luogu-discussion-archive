import UserInput from "../UserInput";
import TabNavigation from "./TabNavigation";

export default function Layout({
  children,
  params,
}: React.PropsWithChildren<{ params: { uid: string } }>) {
  return (
    <>
      <UserInput initialValue={params.uid} />
      <TabNavigation uid={params.uid} />
      {children}
    </>
  );
}
