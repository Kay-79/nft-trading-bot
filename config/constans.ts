export const TOPPICS: string[] = [
    process.env.TOPIC_CREATE || "default_topic",
    process.env.TOPIC_BID || "default_topic",
    process.env.TOPIC_CANCEL || "default_topic",
    process.env.TOPIC_CHANGE || "default_topic",
    process.env.TOPIC_HASH || "default_topic"
];
