import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGO_URI;

export class UserService {
  static async createUser(userData) {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const usersCollection = db.collection('users');

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const userDoc = {
        name: userData.name,
        email: userData.email.toLowerCase(),
        phone: userData.phone || '',
        password: hashedPassword,
        isEmailVerified: false,
        emailVerificationOTP: userData.otp,
        emailVerificationOTPExpires: userData.otpExpiry,
        addresses: [], // Initialize empty addresses array
        role: 'customer',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await usersCollection.insertOne(userDoc);
      
      return {
        success: true,
        userId: result.insertedId,
        user: { ...userDoc, _id: result.insertedId }
      };
    } catch (error) {
      throw error;
    } finally {
      await client.close();
    }
  }

  static async findUserByEmail(email) {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const usersCollection = db.collection('users');

    try {
      const user = await usersCollection.findOne({ email: email.toLowerCase() });
      return user;
    } finally {
      await client.close();
    }
  }

  static async updateUser(userId, updates) {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const usersCollection = db.collection('users');

    try {
      updates.updatedAt = new Date();
      const _id = typeof userId === 'string' ? new ObjectId(userId) : userId;

      const result = await usersCollection.updateOne(
        { _id },
        { $set: updates }
      );

      return result.modifiedCount > 0;
    } finally {
      await client.close();
    }
  }

  // Add new address
  static async addAddress(userId, addressData) {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const usersCollection = db.collection('users');

    try {
      const _id = typeof userId === 'string' ? new ObjectId(userId) : userId;
      
      const newAddress = {
        _id: new ObjectId(),
        type: addressData.type || 'home',
        name: addressData.name,
        phone: addressData.phone,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        landmark: addressData.landmark || '',
        isDefault: addressData.isDefault || false,
        createdAt: new Date()
      };

      // If this is set as default, unset other defaults
      if (newAddress.isDefault) {
        await usersCollection.updateOne(
          { _id },
          { $set: { 'addresses.$[].isDefault': false } }
        );
      }

      const result = await usersCollection.updateOne(
        { _id },
        { 
          $push: { addresses: newAddress },
          $set: { updatedAt: new Date() }
        }
      );

      return result.modifiedCount > 0 ? newAddress : null;
    } finally {
      await client.close();
    }
  }

  // Update existing address
  static async updateAddress(userId, addressId, updates) {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const usersCollection = db.collection('users');

    try {
      const _id = typeof userId === 'string' ? new ObjectId(userId) : userId;
      const addrId = typeof addressId === 'string' ? new ObjectId(addressId) : addressId;

      // If setting as default, unset other defaults first
      if (updates.isDefault) {
        await usersCollection.updateOne(
          { _id },
          { $set: { 'addresses.$[].isDefault': false } }
        );
      }

      const result = await usersCollection.updateOne(
        { _id, 'addresses._id': addrId },
        { 
          $set: {
            'addresses.$.type': updates.type,
            'addresses.$.name': updates.name,
            'addresses.$.phone': updates.phone,
            'addresses.$.street': updates.street,
            'addresses.$.city': updates.city,
            'addresses.$.state': updates.state,
            'addresses.$.pincode': updates.pincode,
            'addresses.$.landmark': updates.landmark,
            'addresses.$.isDefault': updates.isDefault || false,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } finally {
      await client.close();
    }
  }

  // Delete address
  static async deleteAddress(userId, addressId) {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const usersCollection = db.collection('users');

    try {
      const _id = typeof userId === 'string' ? new ObjectId(userId) : userId;
      const addrId = typeof addressId === 'string' ? new ObjectId(addressId) : addressId;

      const result = await usersCollection.updateOne(
        { _id },
        { 
          $pull: { addresses: { _id: addrId } },
          $set: { updatedAt: new Date() }
        }
      );

      return result.modifiedCount > 0;
    } finally {
      await client.close();
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    if (!plainPassword || !hashedPassword) {
      return false;
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
