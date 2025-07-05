// import kafka from '@/events/kafka/kafkaClient';
//
// const consumer = kafka.consumer({ groupId: 'user-service' });
//
// interface UserLikedPayload {
//   likerId: string;
//   likedId: string;
// }
//
// type OnUserLikedHandler = (payload: UserLikedPayload) => Promise<void>;
//
// const startConsumer = async (
//   onUserLiked: OnUserLikedHandler
// ): Promise<void> => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: 'user.liked', fromBeginning: false });
//
//   console.log('User liked event received:');
//   await consumer.run({
//     eachMessage: async ({ topic, message }) => {
//       const payload = JSON.parse(
//         message.value?.toString() || '{}'
//       ) as UserLikedPayload;
//
//       if (topic === 'user.liked') {
//         await onUserLiked(payload);
//       }
//     },
//   });
// };
//
// export { startConsumer };
