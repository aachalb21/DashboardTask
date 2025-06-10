import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'users.json');
    
    let users = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      users = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or can't be read, use empty array
      console.log('No existing file, creating new one');
    }
    
    const exists = users.find(u => u.id === body.id);
    if (!exists) {
      users.push(body);
    } else {
      const index = users.findIndex(u => u.id === body.id);
      users[index] = body;
    }
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory already exists or can't be created
      console.log('Directory exists or creation failed:', error);
    }
    
    // Write the entire users array
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ 
      message: "User saved successfully!", 
      user: body 
    }, { status: 200 });

  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "Failed to save user config" }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'users.json');
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const users = JSON.parse(fileContent);
      return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
      // File doesn't exist, return empty array
      return NextResponse.json({ users: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" }, 
      { status: 500 }
    );
  }
}