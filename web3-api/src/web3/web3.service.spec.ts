import { Test, TestingModule } from '@nestjs/testing';

// Mock ethers - must be before any imports
const mockGetAddress = jest.fn();
const mockVerifyMessage = jest.fn();
const mockGetTransactionCount = jest.fn();

jest.mock('ethers', () => ({
  ethers: {
    getAddress: mockGetAddress,
    verifyMessage: mockVerifyMessage,
    hexlify: jest.fn((bytes: Uint8Array) => '0x' + Buffer.from(bytes).toString('hex')),
    randomBytes: jest.fn((length: number) => {
      // Generate random bytes for unique nonces
      const buffer = Buffer.alloc(length);
      for (let i = 0; i < length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
      return buffer;
    }),
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getTransactionCount: mockGetTransactionCount,
    })),
  },
}));

import { Web3Service } from './web3.service';

describe('Web3Service', () => {
  let web3Service: Web3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Web3Service],
    }).compile();

    web3Service = module.get<Web3Service>(Web3Service);

    jest.clearAllMocks();
  });

  describe('generateNonce', () => {
    it('should generate a random nonce', () => {
      const nonce = web3Service.generateNonce();

      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
    });

    it('should return different nonces on each call', () => {
      const nonce1 = web3Service.generateNonce();
      const nonce2 = web3Service.generateNonce();

      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('isValidAddress', () => {
    beforeEach(() => {
      // Mock getAddress to throw for invalid addresses and return for valid ones
      mockGetAddress.mockImplementation((addr: string) => {
        if (!addr || typeof addr !== 'string' || !addr.startsWith('0x') || addr.length !== 42) {
          throw new Error('invalid address');
        }
        return addr.toLowerCase();
      });
    });

    it('should return true for valid Ethereum address', () => {
      const validAddress = '0x1234567890123456789012345678901234567890';

      const result = web3Service.isValidAddress(validAddress);

      expect(result).toBe(true);
    });

    it('should return false for invalid address - too short', () => {
      const invalidAddress = '0x123';

      const result = web3Service.isValidAddress(invalidAddress);

      expect(result).toBe(false);
    });

    it('should return false for invalid address - missing 0x prefix', () => {
      const invalidAddress = '1234567890123456789012345678901234567890';

      const result = web3Service.isValidAddress(invalidAddress);

      expect(result).toBe(false);
    });

    it('should return false for invalid address - wrong format', () => {
      const invalidAddress = 'not-an-address';

      const result = web3Service.isValidAddress(invalidAddress);

      expect(result).toBe(false);
    });
  });

  describe('getChecksumAddress', () => {
    it('should return checksummed address', () => {
      const address = '0x1234567890123456789012345678901234567890';
      mockGetAddress.mockReturnValue(address.toLowerCase());

      const result = web3Service.getChecksumAddress(address);

      expect(mockGetAddress).toHaveBeenCalledWith(address);
      expect(result).toBeDefined();
    });

    it('should handle lowercase input', () => {
      const lowercaseAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
      mockGetAddress.mockReturnValue(lowercaseAddress);

      const result = web3Service.getChecksumAddress(lowercaseAddress);

      expect(mockGetAddress).toHaveBeenCalledWith(lowercaseAddress);
      expect(result).toBeDefined();
    });
  });

  describe('verifySignature', () => {
    const message = 'Sign this message';
    const signature = '0xvalid-signature';
    const walletAddress = '0x1234567890123456789012345678901234567890';
    const differentSignerAddress = '0xabcdef1234567890abcdef1234567890abcdef12';

    beforeEach(() => {
      mockGetAddress.mockImplementation((addr: string) => {
        return addr.toLowerCase();
      });
    });

    it('should return true for valid signature', async () => {
      mockVerifyMessage.mockReturnValue(walletAddress);

      const result = await web3Service.verifySignature(message, signature, walletAddress);

      expect(mockVerifyMessage).toHaveBeenCalledWith(message, signature);
      expect(mockGetAddress).toHaveBeenCalledWith(walletAddress);
      expect(result).toBe(true);
    });

    it('should return false for invalid signature', async () => {
      mockVerifyMessage.mockReturnValue(differentSignerAddress);

      const result = await web3Service.verifySignature(message, signature, walletAddress);

      expect(result).toBe(false);
    });

    it('should return false for invalid address format', async () => {
      mockVerifyMessage.mockReturnValue(walletAddress);
      mockGetAddress.mockImplementationOnce(() => {
        throw new Error('invalid address');
      });

      const result = await web3Service.verifySignature(
        message,
        signature,
        'invalid-address',
      );

      expect(result).toBe(false);
    });

    it('should return false when verification throws error', async () => {
      mockVerifyMessage.mockImplementation(() => {
        throw new Error('verification failed');
      });

      const result = await web3Service.verifySignature(message, signature, walletAddress);

      expect(result).toBe(false);
    });
  });

  describe('getTransactionCount', () => {
    const walletAddress = '0x1234567890123456789012345678901234567890';

    it('should return transaction count for a wallet', async () => {
      const mockCount = 42;
      mockGetTransactionCount.mockResolvedValue(mockCount);

      const result = await web3Service.getTransactionCount(walletAddress);

      expect(mockGetTransactionCount).toHaveBeenCalledWith(
        walletAddress.toLowerCase(),
      );
      expect(result).toBe(mockCount);
    });

    it('should return 0 when provider throws error', async () => {
      mockGetTransactionCount.mockRejectedValue(new Error('provider error'));

      const result = await web3Service.getTransactionCount(walletAddress);

      expect(result).toBe(0);
    });
  });

  describe('verifyNFTOwnership', () => {
    const walletAddress = '0x1234567890123456789012345678901234567890';
    const contractAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
    const tokenId = '123';

    it('should return true (demo implementation)', async () => {
      mockGetAddress.mockReturnValue(walletAddress.toLowerCase());

      const result = await web3Service.verifyNFTOwnership(
        walletAddress,
        contractAddress,
        tokenId,
      );

      // Current implementation always returns true for demo
      expect(result).toBe(true);
    });

    it('should return false when error occurs', async () => {
      mockGetAddress.mockImplementationOnce(() => {
        throw new Error('invalid address');
      });

      const result = await web3Service.verifyNFTOwnership(
        'invalid-address',
        contractAddress,
        tokenId,
      );

      expect(result).toBe(false);
    });
  });
});
