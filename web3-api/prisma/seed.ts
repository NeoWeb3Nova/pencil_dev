import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@web3jobs.com' },
    update: {},
    create: {
      email: 'admin@web3jobs.com',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'admin',
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'user@web3jobs.com' },
    update: {},
    create: {
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
      description: '加入我们，一起构建去中心化的未来。我们将开发区块链基础设施和智能合约解决方案。',
      requirements: [
        '3+ 年 Solidity 开发经验',
        '深入理解 DeFi 协议',
        '熟悉 Hardhat 和 Foundry 开发工具',
      ],
      skills: ['Solidity', 'Web3.js', 'DeFi', 'Ethereum'],
      type: 'FULL_TIME',
      status: 'published',
      postedBy: { connect: { id: adminUser.id } },
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
      requirements: [
        '3+ 年 React 开发经验',
        '熟悉 Web3 集成',
        '有 DeFi 项目经验',
      ],
      skills: ['React', 'TypeScript', 'Web3', 'DeFi'],
      type: 'FULL_TIME',
      status: 'published',
      postedBy: { connect: { id: adminUser.id } },
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: '智能合约审计师',
      company: 'OpenZeppelin',
      location: '远程',
      salaryMin: 150000,
      salaryMax: 200000,
      description: '负责审计智能合约代码，发现安全漏洞。',
      requirements: [
        '5+ 年智能合约开发经验',
        '熟悉常见安全漏洞',
        '有审计经验者优先',
      ],
      skills: ['Solidity', 'Security', 'Auditing', 'DeFi'],
      type: 'FULL_TIME',
      status: 'published',
      postedBy: { connect: { id: adminUser.id } },
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
      requirements: [
        '熟悉区块链 API 开发',
        '有高并发系统经验',
        '熟悉 Go 或 Rust',
      ],
      skills: ['Go', 'Rust', 'Blockchain', 'API'],
      type: 'FULL_TIME',
      status: 'published',
      postedBy: { connect: { id: adminUser.id } },
    },
  });

  console.log('✅ Jobs created');

  // Create applications
  await prisma.application.create({
    data: {
      jobId: job1.id,
      userId: testUser.id,
      status: 'pending',
      coverLetter: '我对这个职位非常感兴趣，期待能加入团队！',
    },
  });

  console.log('✅ Applications created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
