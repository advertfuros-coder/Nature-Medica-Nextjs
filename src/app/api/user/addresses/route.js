import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

export async function GET(req) {
  try {
    await connectDB();
    const authData = await requireAuth(req);

    const userDoc = await User.findById(authData.userId);

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userDoc.toObject(); // Converts mongoose doc to plain object
    delete user.password; // remove for security

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const authData = await requireAuth(req);

    if (!authData?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressData = await req.json();

    // Validate mandatory fields
    const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!addressData[field] || typeof addressData[field] !== 'string' || addressData[field].trim() === '') {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate street hygiene
    if (addressData.street.trim().length < 5) {
      return NextResponse.json({ error: 'Street address is too short. Please provide House/Flat No. and Street.' }, { status: 400 });
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(addressData.pincode)) {
      return NextResponse.json({ error: 'Pincode must be 6 digits' }, { status: 400 });
    }

    // Validate phone number (digits only, 10-15 chars)
    if (!/^\d{10,15}$/.test(addressData.phone.replace(/\D/g, ''))) {
      return NextResponse.json({ error: 'Phone number must be 10-15 digits' }, { status: 400 });
    }

    const user = await User.findById(authData.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!Array.isArray(user.addresses)) {
      user.addresses = [];
    }

    // Handle default address
    if (user.addresses.length === 0 || addressData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
      addressData.isDefault = true;
    }

    // Push new address
    user.addresses.push({
      name: addressData.name.trim(),
      phone: addressData.phone.trim(),
      street: addressData.street.trim(),
      city: addressData.city.trim(),
      state: addressData.state.trim(),
      pincode: addressData.pincode.trim(),
      landmark: addressData.landmark?.trim() || '',
      type: addressData.type || 'home',
      isDefault: addressData.isDefault || false,
      addressScore: addressData.addressScore || 0,
      addressQuality: addressData.addressQuality || 'Standard'
    });

    user.markModified('addresses');
    await user.save();

    return NextResponse.json({
      success: true,
      addresses: user.addresses.map(addr => addr.toObject())
    });
  } catch (error) {
    console.error('POST /api/user/addresses error:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const authData = await requireAuth(req);

    if (!authData?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressData = await req.json();
    if (!addressData._id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const user = await User.findById(authData.userId);
    if (!user || !Array.isArray(user.addresses)) {
      return NextResponse.json({ error: 'User or addresses not found' }, { status: 404 });
    }

    const index = user.addresses.findIndex(addr => addr._id.toString() === addressData._id);
    if (index === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const fieldsToUpdate = ['name', 'phone', 'street', 'city', 'state', 'pincode', 'landmark', 'type', 'isDefault'];
    fieldsToUpdate.forEach(field => {
      if (addressData[field] !== undefined) {
        user.addresses[index][field] = addressData[field];
      }
    });

    // If isDefault set true, unset default on others
    if (addressData.isDefault) {
      user.addresses.forEach((addr, i) => {
        if (i !== index) addr.isDefault = false;
      });
    }

    user.markModified('addresses');
    await user.save();

    return NextResponse.json({
      success: true,
      addresses: user.addresses.map(addr => addr.toObject())
    });
  } catch (error) {
    console.error('PUT /api/user/addresses error:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await requireAuth(req);

    if (!authData?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('id');
    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const user = await User.findById(authData.userId);
    if (!user || !Array.isArray(user.addresses)) {
      return NextResponse.json({ error: 'User or addresses not found' }, { status: 404 });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);

    // Ensure one default address exists
    if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    user.markModified('addresses');
    await user.save();

    return NextResponse.json({
      success: true,
      addresses: user.addresses.map(addr => addr.toObject())
    });
  } catch (error) {
    console.error('DELETE /api/user/addresses error:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
