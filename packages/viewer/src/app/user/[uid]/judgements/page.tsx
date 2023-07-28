import UserJudgements from "./UserJudgements";

export default function Page({ params }: { params: { uid: string } }) {
  return <UserJudgements uid={params.uid} />;
}
