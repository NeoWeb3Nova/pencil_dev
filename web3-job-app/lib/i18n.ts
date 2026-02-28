// 国际化语言配置
export const translations = {
  zh: {
    // 个人中心
    myResume: '我的简历',
    savedJobs: '保存的职位',
    walletConnect: '钱包连接',
    darkMode: '深色模式',
    language: '语言',
    analytics: '数据统计',

    // 统计
    applied: '已申请',
    interviews: '面试',
    offers: 'Offer',

    // 语言选择
    selectLanguage: '选择语言',
    chinese: '中文',
    english: 'English',
    cancel: '取消',
    confirm: '确认',

    // 首页
    homeTitle: '首页',
    heroTitle: '🚀 加入 Ethereum Foundation',
    heroSubtitle: '构建去中心化的未来',
    searchLabel: '搜索',
    searchPlaceholder: 'Web3、智能合约...',
    categoryAll: '全部职位',
    categorySolidity: '智能合约',
    categoryFrontend: '前端',
    categoryDeFi: 'DeFi',
    recommendedJobs: '推荐职位',
    viewAll: '查看全部',

    // 职位
    jobsTitle: '职位',
    browseJobs: '浏览职位',
    jobDetails: '职位详情',
    back: '返回',
    jobDescription: '职位描述',
    jobRequirements: '职位要求',
    skillsTags: '技能标签',
    applyNow: '立即申请',
    categoryAll: '全部',
    categorySolidity: '智能合约',
    categoryFrontend: '前端',
    categoryBackend: '后端',
    categoryDeFi: 'DeFi',
    categoryNFT: 'NFT',

    // 发布职位
    postTitle: '发布',
    postJobTitle: '发布职位',
    jobTitleLabel: '职位名称',
    jobTitlePlaceholder: '高级 Solidity 工程师',
    companyLabel: '公司名称',
    companyPlaceholder: '以太坊基金会',
    locationLabel: '工作地点',
    locationPlaceholder: '远程 / 上海',
    salaryMinLabel: '最低薪资',
    salaryMinPlaceholder: '$80K',
    salaryMaxLabel: '最高薪资',
    salaryMaxPlaceholder: '$180K',
    jobTypeLabel: '工作类型',
    jobTypeFullTime: '全职',
    jobTypeContract: '合同',
    jobTypePartTime: '兼职',
    skillsLabel: '要求技能',
    submitJob: '发布职位 - ¥299',

    // 消息
    messagesTitle: '消息',
    messagesHeader: '消息',
    searchMessagesPlaceholder: '搜索消息...',

    // 个人中心
    profileTitle: '我的',
    profileHeader: '个人中心',
  },
  en: {
    // Profile
    myResume: 'My Resume',
    savedJobs: 'Saved Jobs',
    walletConnect: 'Wallet Connect',
    darkMode: 'Dark Mode',
    language: 'Language',
    analytics: 'Analytics',

    // Stats
    applied: 'Applied',
    interviews: 'Interviews',
    offers: 'Offers',

    // Language Selection
    selectLanguage: 'Select Language',
    chinese: '中文',
    english: 'English',
    cancel: 'Cancel',
    confirm: 'Confirm',

    // Home
    homeTitle: 'Home',
    heroTitle: '🚀 Join Ethereum Foundation',
    heroSubtitle: 'Building the Decentralized Future',
    searchLabel: 'Search',
    searchPlaceholder: 'Web3, Smart Contracts...',
    categoryAll: 'All Jobs',
    categorySolidity: 'Smart Contracts',
    categoryFrontend: 'Frontend',
    categoryDeFi: 'DeFi',
    recommendedJobs: 'Recommended Jobs',
    viewAll: 'View All',

    // Jobs
    jobsTitle: 'Jobs',
    browseJobs: 'Browse Jobs',
    jobDetails: 'Job Details',
    back: 'Back',
    jobDescription: 'Job Description',
    jobRequirements: 'Requirements',
    skillsTags: 'Skills',
    applyNow: 'Apply Now',
    categoryAll: 'All',
    categorySolidity: 'Smart Contracts',
    categoryFrontend: 'Frontend',
    categoryBackend: 'Backend',
    categoryDeFi: 'DeFi',
    categoryNFT: 'NFT',

    // Post Job
    postTitle: 'Post',
    postJobTitle: 'Post Job',
    jobTitleLabel: 'Job Title',
    jobTitlePlaceholder: 'Senior Solidity Engineer',
    companyLabel: 'Company',
    companyPlaceholder: 'Ethereum Foundation',
    locationLabel: 'Location',
    locationPlaceholder: 'Remote / Shanghai',
    salaryMinLabel: 'Min Salary',
    salaryMinPlaceholder: '$80K',
    salaryMaxLabel: 'Max Salary',
    salaryMaxPlaceholder: '$180K',
    jobTypeLabel: 'Job Type',
    jobTypeFullTime: 'Full-time',
    jobTypeContract: 'Contract',
    jobTypePartTime: 'Part-time',
    skillsLabel: 'Required Skills',
    submitJob: 'Post Job - ¥299',

    // Messages
    messagesTitle: 'Messages',
    messagesHeader: 'Messages',
    searchMessagesPlaceholder: 'Search messages...',

    // Profile
    profileTitle: 'Profile',
    profileHeader: 'Profile',
  },
};

export type Language = 'zh' | 'en';
export type TranslationKey = keyof typeof translations.zh;

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || translations.zh[key] || key;
}
