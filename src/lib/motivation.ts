import { Lang } from "./store";

type MotivationPack = Record<Lang, string[]>;

const FALLBACK_MOTIVATION: MotivationPack = {
  en: [
    "Small care today becomes visible growth tomorrow.",
    "Choose one gentle win and let the day open from there.",
    "Consistency is quiet. Let today count.",
    "A clear next step is enough to begin.",
    "Tend the plan in front of you. The bigger goal can wait its turn.",
  ],
  th: [
    "ดูแลเล็ก ๆ วันนี้ จะกลายเป็นการเติบโตที่เห็นได้ในวันพรุ่งนี้",
    "เลือกชัยชนะเล็ก ๆ หนึ่งอย่าง แล้วให้วันนี้เริ่มจากตรงนั้น",
    "ความสม่ำเสมอไม่ต้องดัง แค่ให้วันนี้นับได้ก็พอ",
    "แค่เห็นก้าวถัดไปชัดพอ ก็เริ่มได้แล้ว",
    "ดูแลแผนตรงหน้าก่อน เป้าหมายใหญ่รอคิวได้",
  ],
  "zh-CN": [
    "今天的小小照料，会变成明天看得见的成长。",
    "先完成一个温柔的小胜利，让一天从那里展开。",
    "坚持可以很安静，让今天也算数。",
    "看清下一步，就足够开始。",
    "先照料眼前的计划，大目标可以排队等候。",
  ],
  "zh-TW": [
    "今天小小的照料，會變成明天看得見的成長。",
    "先完成一個溫柔的小勝利，讓一天從那裡展開。",
    "穩定可以很安靜，讓今天也算數。",
    "看清下一步，就足夠開始。",
    "先照料眼前的計畫，大目標可以排隊等候。",
  ],
};

export function getDailyMotivation(date: string, lang: Lang): string {
  const pack = FALLBACK_MOTIVATION[lang] ?? FALLBACK_MOTIVATION.en;
  const seed = date
    .split("")
    .reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  return pack[seed % pack.length];
}
