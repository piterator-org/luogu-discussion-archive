import UserParticipated from "./participated/UserParticipated";

export default function Page({ params }: { params: { uid: string } }) {
  return <UserParticipated uid={params.uid} />;
}
