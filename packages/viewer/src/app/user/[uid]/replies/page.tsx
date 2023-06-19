import UserReplies from "./UserReplies";

export default function Page({ params }: { params: { uid: string } }) {
  return <UserReplies uid={params.uid} />;
}
