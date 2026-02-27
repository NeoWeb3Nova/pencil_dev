// Use compiled JavaScript from prisma.config.ts
require('dotenv').config();
const { prisma } = require('../prisma.config');
const bcrypt = require('bcrypt');

async function main() {
  console.log('🌱 Starting seed...');

  // Delete existing data
  await prisma.application.deleteMany();
  await prisma.message.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️  Existing data deleted');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@web3jobs.com',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'admin',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@web3jobs.com',
      name: 'Test User',
      passwordHash: hashedPassword,
      role: 'user',
    },
  });

  console.log('✅ Users created');

  // Create jobs
  const job1 = await prisma.job.create({
    data: {
      title: '高级 Solidity 工程师',
      company: '以太坊基金会',
      location: '远程',
      salaryMin: 120000,
      salaryMax: 180000,
      description: '加入我们，一起构建去中心化的未来。',
      requirements: ['3+ 年 Solidity 开发经验', '深入理解 DeFi 协议'],
      skills: ['Solidity', 'Web3.js', 'DeFi'],
      type: 'FULL_TIME',
      status: 'published',
      postedById: admin.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: '前端工程师',
      company: 'Uniswap',
      location: '远程',
      salaryMin: 80000,
      salaryMax: 120000,
      description: '构建世界领先的去中心化交易所界面。',
      requirements: ['3+ 年 React 开发经验', '熟悉 Web3 集成'],
      skills: ['React', 'TypeScript', 'Web3'],
      type: 'FULL_TIME',
      status: 'published',
      postedById: admin.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: '智能合约审计师',
      company: 'OpenZeppelin',
      location: '远程',
      salaryMin: 150000,
      salaryMax: 200000,
      description: '负责审计智能合约代码。',
      requirements: ['5+ 年智能合约开发经验'],
      skills: ['Solidity', 'Security', 'Auditing'],
      type: 'FULL_TIME',
      status: 'published',
      postedById: admin.id,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: '区块链后端工程师',
      company: 'Coinbase',
      location: '上海/远程',
      salaryMin: 100000,
      salaryMax: 150000,
      description: '构建可扩展的区块链基础设施服务。',
      requirements: ['有高并发系统经验'],
      skills: ['Go', 'Rust', 'Blockchain'],
      type: 'FULL_TIME',
      status: 'published',
      postedById: admin.id,
    },
  });

  console.log('✅ Jobs created');

  // Create application
  await prisma.application.create({
    data: {
      jobId: job1.id,
      userId: user.id,
      status: 'pending',
      coverLetter: '我对这个职位非常感兴趣！',
    },
  });

  console.log('✅ Applications created');
  console.log('🎉 Seed completed successfully!');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
