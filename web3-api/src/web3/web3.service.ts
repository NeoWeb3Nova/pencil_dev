import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';

/**
 * Web3 service for wallet verification and blockchain interactions
 */
@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  private provider: ethers.Provider;

  constructor() {
    // Initialize with a default RPC provider (Ethereum mainnet)
    // In production, use environment variable for RPC URL
    const rpcUrl = process.env.WEB3_RPC_URL || 'https://eth.llamarpc.com';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Verify a wallet signature against a message
   * Uses Ethereum personal_sign standard
   */
  async verifySignature(
    message: string,
    signature: string,
    walletAddress: string,
  ): Promise<boolean> {
    try {
      // Normalize address (ensure checksum)
      const normalizedAddress = ethers.getAddress(walletAddress);

      // Recover signer from message and signature
      const signerAddress = ethers.verifyMessage(message, signature);

      // Check if recovered signer matches the claimed wallet address
      return ethers.getAddress(signerAddress) === normalizedAddress;
    } catch (error) {
      this.logger.error(`Signature verification failed: ${error}`);
      return false;
    }
  }

  /**
   * Generate a nonce for wallet verification
   */
  generateNonce(): string {
    return ethers.hexlify(ethers.randomBytes(16)).replace('0x', '');
  }

  /**
   * Verify if an address is a valid Ethereum address
   */
  isValidAddress(address: string): boolean {
    try {
      ethers.getAddress(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the checksummed version of an address
   */
  getChecksumAddress(address: string): string {
    return ethers.getAddress(address);
  }

  /**
   * Verify ownership of an NFT token
   * Note: This is a simplified implementation - in production, you'd
   * query actual NFT contracts
   */
  async verifyNFTOwnership(
    walletAddress: string,
    contractAddress: string,
    tokenId: string,
  ): Promise<boolean> {
    try {
      // Simplified ERC721 ownership check
      // In production, use actual contract ABI and call ownerOf(tokenId)
      const normalizedAddress = ethers.getAddress(walletAddress);

      // TODO: Implement actual NFT contract interaction
      // const contract = new ethers.Contract(contractAddress, ERC721_ABI, this.provider);
      // const owner = await contract.ownerOf(tokenId);
      // return ethers.getAddress(owner) === normalizedAddress;

      this.logger.warn('NFT verification not fully implemented - returning true for demo');
      return true;
    } catch (error) {
      this.logger.error(`NFT ownership verification failed: ${error}`);
      return false;
    }
  }

  /**
   * Get transaction count for a wallet (proxy for activity)
   */
  async getTransactionCount(walletAddress: string): Promise<number> {
    try {
      const normalizedAddress = ethers.getAddress(walletAddress);
      const count = await this.provider.getTransactionCount(normalizedAddress);
      return count;
    } catch (error) {
      this.logger.error(`Failed to get transaction count: ${error}`);
      return 0;
    }
  }
}
