import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const configuration = await req.json();
    
    // Validate required fields
    if (!configuration.id || !configuration.provider || !configuration.model || !configuration.language) {
      return NextResponse.json(
        { error: "Missing required fields in configuration" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', 'agent-selection.json');
    let configurations = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      configurations = JSON.parse(fileContent);
      if (!Array.isArray(configurations)) {
        configurations = [];
      }
    } catch (error) {
      console.log('Creating new configurations file');
    }
    
    // Find existing configuration for this user
    const index = configurations.findIndex(c => c.id === configuration.id);
    
    if (index !== -1) {
      configurations[index] = configuration;
    } else {
      configurations.push(configuration);
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true }).catch(() => {});
    
    // Write configurations to file
    await fs.writeFile(filePath, JSON.stringify(configurations, null, 2));

    return NextResponse.json({ 
      message: "Configuration saved successfully",
      configuration
    }, { status: 200 });

  } catch (error) {
    console.error("Error saving configuration:", error);
    return NextResponse.json(
      { error: "Failed to save configuration: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'agent-selection.json');
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const configurations = JSON.parse(fileContent);
      return NextResponse.json({ configurations }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ configurations: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching configurations:", error);
    return NextResponse.json(
      { error: "Failed to fetch configurations" },
      { status: 500 }
    );
  }
}