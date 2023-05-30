export default function getForumName(forum: string) {
  return (
    {
      siteaffairs: "站务版",
      problem: "题目总版",
      academics: "学术版",
      relevantaffairs: "灌水区",
      service: "反馈、申请、工单专版",
    }[forum] ?? forum
  );
}
