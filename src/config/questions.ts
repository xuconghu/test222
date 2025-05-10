
import type { AssessmentQuestion } from '@/types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // 一、感知潜能
  {
    id: 'q1_1_1',
    category: '一、感知潜能',
    subCategory: '感知接收能力',
    text: '它可以观察周围环境。',
  },
  {
    id: 'q1_1_2',
    category: '一、感知潜能',
    subCategory: '感知接收能力',
    text: '它可以了解周围发生的变化。',
  },
  {
    id: 'q1_1_3',
    category: '一、感知潜能',
    subCategory: '感知接收能力',
    text: '它可以察觉附近新出现的事物。',
  },
  {
    id: 'q1_1_4',
    category: '一、感知潜能',
    subCategory: '感知接收能力',
    text: '它可以察觉我的反馈。',
  },
  {
    id: 'q1_2_1',
    category: '一、感知潜能',
    subCategory: '共享注意能力',
    text: '它知道我在注意什么。',
  },
  {
    id: 'q1_2_2',
    category: '一、感知潜能',
    subCategory: '共享注意能力',
    text: '它可以预测我将注意什么。',
  },
  {
    id: 'q1_2_3',
    category: '一、感知潜能',
    subCategory: '共享注意能力',
    text: '它能理解我们正在关注相同的事物。',
  },
  {
    id: 'q1_2_4',
    category: '一、感知潜能',
    subCategory: '共享注意能力',
    text: '它理解实现协作需要我们关注相同的目标。',
  },
  {
    id: 'q1_3_1',
    category: '一、感知潜能',
    subCategory: '感知表达能力',
    text: '我很容易看出它是否在观察周围环境。',
  },
  {
    id: 'q1_3_2',
    category: '一、感知潜能',
    subCategory: '感知表达能力',
    text: '当它注意到某个东西时，会很明显的表现出来。',
  },
  {
    id: 'q1_3_3',
    category: '一、感知潜能',
    subCategory: '感知表达能力',
    text: '我很容易看出它正在注意什么。',
  },
  {
    id: 'q1_3_4',
    category: '一、感知潜能',
    subCategory: '感知表达能力',
    text: '我可以根据它的表现判断它是否会调整注意的对象。',
  },
  // 二、行为潜能
  {
    id: 'q2_1_1',
    category: '二、行为潜能',
    subCategory: '自主性',
    text: '它可以自主设置行动目标。',
  },
  {
    id: 'q2_1_2',
    category: '二、行为潜能',
    subCategory: '自主性',
    text: '它可以自主设计行动计划来实现目标。',
  },
  {
    id: 'q2_1_3',
    category: '二、行为潜能',
    subCategory: '自主性',
    text: '它可以做出行动。',
  },
  {
    id: 'q2_1_4',
    category: '二、行为潜能',
    subCategory: '自主性',
    text: '它可以自主调整行为。',
  },
  {
    id: 'q2_2_1',
    category: '二、行为潜能',
    subCategory: '社会交互性',
    text: '它想与我互动。',
  },
  {
    id: 'q2_2_2',
    category: '二、行为潜能',
    subCategory: '社会交互性',
    text: '它可以自主设计怎样与我互动。',
  },
  {
    id: 'q2_2_3',
    category: '二、行为潜能',
    subCategory: '社会交互性',
    text: '它可以通过行动与我互动。',
  },
  {
    id: 'q2_2_4',
    category: '二、行为潜能',
    subCategory: '社会交互性',
    text: '它可以预测我对于它的行动的反馈。',
  },
  {
    id: 'q2_2_5',
    category: '二、行为潜能',
    subCategory: '社会交互性',
    text: '它可以理解我做出的言语或行为反馈。',
  },
  {
    id: 'q2_2_6',
    category: '二、行为潜能',
    subCategory: '社会交互性',
    text: '它可以根据我的反馈调整它的行为。',
  },
  {
    id: 'q2_2_7',
    category: '二、行为潜能',
    subCategory: '社会交互性',
    text: '我想与它互动。',
  },
  // 三、感知/行为因果性
  {
    id: 'q3_1_1',
    category: '三、感知/行为因果性',
    subCategory: '感知/行为因果性',
    text: '它感知到物体之后会做出相应的行为。',
  },
  {
    id: 'q3_1_2',
    category: '三、感知/行为因果性',
    subCategory: '感知/行为因果性',
    text: '它会先观察周围情况再采取行动。',
  },
  {
    id: 'q3_1_3',
    category: '三、感知/行为因果性',
    subCategory: '感知/行为因果性',
    text: '它在得到新信息之后会调整自己的行为。',
  },
  {
    id: 'q3_1_4',
    category: '三、感知/行为因果性',
    subCategory: '感知/行为因果性',
    text: '它会根据周围情况选择合适的行为，而不是随意行动。',
  },
];

export const INITIAL_SLIDER_VALUE = 50;
