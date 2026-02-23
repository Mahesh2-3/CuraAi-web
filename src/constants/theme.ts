import {
  AlertTriangle,
  Hospital,
  FileText,
  User,
  MessageSquare,
} from "lucide-react";

export const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "ar", name: "Arabic", native: "العربية" },
];

export const msgStyles = "p-4 mt-3 rounded-lg w-fit";

export const sidebarOptions = [
  {
    label: "Chat",
    icon: MessageSquare,
    link: "/",
  },
  {
    label: "Diseases",
    icon: AlertTriangle,
    link: "/diseases",
  },
  {
    label: "CareNearBy",
    icon: Hospital,
    link: "/care-near-by",
  },
  {
    label: "Get Summary",
    icon: FileText,
    link: "/get-summary",
  },
];

export const history = [
  {
    title: "feeling little dizzy and also having headache with mild fever",
    chatId: "1",
  },
  {
    title: "i have been coughing a lot and having chest pain",
    chatId: "2",
  },
  {
    title: "i have a sore throat and runny nose",
    chatId: "3",
  },
  {
    title: "i have been experiencing stomach pain and nausea",
    chatId: "4",
  },
  {
    title: "i have a skin rash and itching",
    chatId: "5",
  },
  {
    title: "i have a sore throat and runny nose",
    chatId: "3",
  },
  {
    title: "i have been experiencing stomach pain and nausea",
    chatId: "4",
  },
  {
    title: "i have a skin rash and itching",
    chatId: "5",
  },
  {
    title: "i have a sore throat and runny nose",
    chatId: "3",
  },
  {
    title: "i have been experiencing stomach pain and nausea",
    chatId: "4",
  },
  {
    title: "i have a skin rash and itching",
    chatId: "5",
  },
  {
    title: "i have a sore throat and runny nose",
    chatId: "3",
  },
  {
    title: "i have been experiencing stomach pain and nausea",
    chatId: "4",
  },
  {
    title: "i have a skin rash and itching",
    chatId: "5",
  },
  {
    title: "i have a sore throat and runny nose",
    chatId: "3",
  },
  {
    title: "i have been experiencing stomach pain and nausea",
    chatId: "4",
  },
  {
    title: "i have a skin rash and itching",
    chatId: "5",
  },
];

export const carenearby = [
  {
    diseaseName: "Viral Fever",
    slug: "viral-fever",
    threatEstimated: "85%",
    history: [
      { date: "2025-10-01", threatPercentage: 65 },
      { date: "2025-10-05", threatPercentage: 70 },
      { date: "2025-10-10", threatPercentage: 80 },
      { date: "2025-10-20", threatPercentage: 85 },
    ],
    recommendations: [
      "Stay hydrated and rest adequately.",
      "Avoid crowded places to prevent spread.",
      "Consult a doctor if fever persists for more than 3 days.",
    ],
    analysis: [
      "Rapid increase in cases over the last two weeks.",
      "Higher threat in urban areas compared to rural regions.",
      "Majority of cases reported in age group 20-40.",
    ],
    hospitals: [
      {
        name: "Mahesh Clinical Facility",
        distance: "5km",
        rating: 3.9,
        address:
          "Varahagiri Nagar Colony, Service Road, near APGVB Bank, near NH5, Yendada, Visakhapatnam, Andhra Pradesh 530045",
        contact: 1234567890,
      },
      {
        name: "City Care Hospital",
        distance: "7km",
        rating: 4.3,
        address:
          "RK Beach Road, Opp. Submarine Museum, Visakhapatnam, Andhra Pradesh 530017",
        contact: 9876543210,
      },
    ],
  },
  {
    diseaseName: "Dengue Fever",
    slug: "dengue-fever",
    threatEstimated: "72%",
    history: [
      { date: "2025-10-01", threatPercentage: 50 },
      { date: "2025-10-07", threatPercentage: 60 },
      { date: "2025-10-15", threatPercentage: 70 },
      { date: "2025-10-20", threatPercentage: 72 },
    ],
    recommendations: [
      "Use mosquito repellent and nets.",
      "Remove standing water around home to prevent mosquito breeding.",
      "Consult hospital immediately if symptoms worsen.",
    ],
    analysis: [
      "Steady increase in threat over the past month.",
      "High concentration of cases near water bodies.",
      "Most cases reported during rainy season.",
    ],
    hospitals: [
      {
        name: "Apollo Health Center",
        distance: "4.2km",
        rating: 4.6,
        address: "Health City, Arilova, Visakhapatnam, Andhra Pradesh 530040",
        contact: 9123456789,
      },
      {
        name: "Suraksha Diagnostic & Hospital",
        distance: "6.5km",
        rating: 4.2,
        address: "Dwaraka Nagar 3rd Lane, Visakhapatnam, Andhra Pradesh 530016",
        contact: 8004567890,
      },
    ],
  },
  {
    diseaseName: "Malaria",
    slug: "malaria",
    threatEstimated: "64%",
    history: [
      { date: "2025-10-01", threatPercentage: 45 },
      { date: "2025-10-05", threatPercentage: 50 },
      { date: "2025-10-12", threatPercentage: 60 },
      { date: "2025-10-20", threatPercentage: 64 },
    ],
    recommendations: [
      "Take antimalarial medication as prescribed.",
      "Avoid mosquito bites using nets or repellents.",
      "Maintain clean surroundings to reduce mosquito breeding.",
    ],
    analysis: [
      "Threat is moderate, showing slow upward trend.",
      "Majority of cases in suburban areas.",
      "High-risk during rainy season due to stagnant water.",
    ],
    hospitals: [
      {
        name: "Care Multi Speciality Hospital",
        distance: "5.5km",
        rating: 4.4,
        address:
          "Rama Talkies Road, Near RTC Complex, Visakhapatnam, Andhra Pradesh 530016",
        contact: 7890123456,
      },
      {
        name: "Susruta Hospital & Research Centre",
        distance: "8km",
        rating: 4.1,
        address:
          "Seethammadhara Junction, Visakhapatnam, Andhra Pradesh 530013",
        contact: 9988776655,
      },
    ],
  },
  {
    diseaseName: "Typhoid",
    slug: "typhoid",
    threatEstimated: "78%",
    history: [
      { date: "2025-10-01", threatPercentage: 60 },
      { date: "2025-10-08", threatPercentage: 65 },
      { date: "2025-10-15", threatPercentage: 70 },
      { date: "2025-10-20", threatPercentage: 78 },
    ],
    recommendations: [
      "Drink only boiled or filtered water.",
      "Maintain good personal hygiene.",
      "Seek medical attention if high fever persists.",
    ],
    analysis: [
      "Threat is high and increasing steadily.",
      "Most cases reported in densely populated neighborhoods.",
      "Contamination of water sources is the main cause.",
    ],
    hospitals: [
      {
        name: "Queens NRI Hospital",
        distance: "6km",
        rating: 4.5,
        address:
          "Seethammadhara Road, Opposite Venkojipalem Park, Visakhapatnam, Andhra Pradesh 530022",
        contact: 9023456789,
      },
      {
        name: "SevenHills Hospital",
        distance: "9km",
        rating: 4.7,
        address:
          "Waltair Main Road, Rockdale Layout, Visakhapatnam, Andhra Pradesh 530002",
        contact: 8901234567,
      },
    ],
  },
];
