export default interface IKafkaService {
  emit(topic: string, key: string, payload: any): Promise<void>;
}
