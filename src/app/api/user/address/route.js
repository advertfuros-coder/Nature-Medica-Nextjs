import { NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import jwt from 'jsonwebtoken';

async function getUserFromToken(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.findUserByEmail(decoded.email);
    return user;
  } catch (error) {
    return null;
  }
}

// Add new address
export async function POST(req) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, street, city, state, pincode, landmark, type, isDefault } = body;

    const addressData = {
      type: type || 'home',
      name: name.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      landmark: landmark?.trim() || '',
      isDefault: isDefault || false
    };

    const newAddress = await UserService.addAddress(user._id, addressData);

    if (!newAddress) {
      return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
    }

    // Get updated user
    const updatedUser = await UserService.findUserByEmail(user.email);

    return NextResponse.json({ 
      message: 'Address added successfully',
      address: newAddress,
      user: {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Add address error:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

// Update address
export async function PUT(req) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { addressId, name, phone, street, city, state, pincode, landmark, type, isDefault } = body;

    const updates = {
      type: type || 'home',
      name: name.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      landmark: landmark?.trim() || '',
      isDefault: isDefault || false
    };

    const success = await UserService.updateAddress(user._id, addressId, updates);

    if (!success) {
      return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
    }

    // Get updated user
    const updatedUser = await UserService.findUserByEmail(user.email);

    return NextResponse.json({ 
      message: 'Address updated successfully',
      user: {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// Delete address
export async function DELETE(req) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('id');

    const success = await UserService.deleteAddress(user._id, addressId);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
    }

    // Get updated user
    const updatedUser = await UserService.findUserByEmail(user.email);

    return NextResponse.json({ 
      message: 'Address deleted successfully',
      user: {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
