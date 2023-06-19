import UserDiscussions from "./UserDiscussions";

export default function Page({ params }: { params: { uid: string } }) {
  return <UserDiscussions uid={params.uid} />;
}
