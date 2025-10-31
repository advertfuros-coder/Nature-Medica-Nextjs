import { NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import jwt from 'jsonwebtoken';

// Get user from token
async function getUserFromToken(req) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.findUserByEmail(decoded.email);
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function PUT(req) {
  try {
    // Get authenticated user
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized. Please login.' 
      }, { status: 401 });
    }

    const body = await req.json();
    console.log('Update profile request:', { userId: user._id, updates: body });

    const { name, phone, address } = body;

    // Build update object
    const updates = {};

    if (name !== undefined) {
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      updates.phone = phone.trim();
    }

    if (address !== undefined) {
      updates.address = {
        street: address.street?.trim() || '',
        city: address.city?.trim() || '',
        state: address.state?.trim() || '',
        pincode: address.pincode?.trim() || '',
        landmark: address.landmark?.trim() || ''
      };
    }

    console.log('Updating user with:', updates);

    // Update user
    const success = await UserService.updateUser(user._id, updates);

    if (!success) {
      return NextResponse.json({ 
        error: 'Failed to update profile' 
      }, { status: 500 });
    }

    // Get updated user
    const updatedUser = await UserService.findUserByEmail(user.email);

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ 
      error: 'Failed to update profile' 
    }, { status: 500 });
  }
}

// GET method to fetch current user profile
export async function GET(req) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ 
      error: 'Failed to get profile' 
    }, { status: 500 });
  }
}
