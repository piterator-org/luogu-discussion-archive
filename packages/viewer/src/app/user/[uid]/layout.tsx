import UserInput from "../UserInput";

export default function Layout({
  children,
  params,
}: React.PropsWithChildren<{ params: { uid: string } }>) {
  return (
    <>
      <UserInput initialValue={params.uid} />
      {children}
    </>
  );
}
