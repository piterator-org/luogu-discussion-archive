// import prisma from "./prisma";
// import { UserSummary } from "./user";

// export const userSnapshotHook = async (user: UserSummary) => {
//   const lastSnapshot = await prisma.userSnapshot.findFirst({
//     where: {
//       userId: user.uid,
//     },
//     orderBy: {
//       time: "desc",
//     },
//   });

//   if (lastSnapshot && lastSnapshot.name === user.name) {

//   } else {

//   }
// };
