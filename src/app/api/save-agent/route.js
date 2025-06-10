import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received agent config:", body);

    // Path to the public folder and agent-selection.json file
    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, "agent-selection.json");
    
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      console.error("Public directory does not exist");
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    let configs = [];
    
    // Read existing configurations if file exists
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        configs = JSON.parse(fileContent);
        if (!Array.isArray(configs)) {
          console.log("Existing file is not an array, initializing empty array");
          configs = [];
        }
      } catch (err) {
        console.error("Error reading existing file:", err);
        configs = [];
      }
    }

    // Add or update configuration
    const configIndex = configs.findIndex(config => 
      config.provider === body.provider && 
      config.model === body.model && 
      config.language === body.language
    );
    
    if (configIndex !== -1) {
      configs[configIndex] = body;
    } else {
      configs.push(body);
    }
    
    // Write the updated array back to the file
    try {
      fs.writeFileSync(filePath, JSON.stringify(configs, null, 2));
      console.log("Configuration saved successfully");
    } catch (err) {
      console.error("Error writing file:", err);
      throw new Error("Failed to write configuration file");
    }

    return new Response(JSON.stringify({ 
      message: "Configuration saved successfully!", 
      config: body 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error saving configuration:", error);
    return new Response(JSON.stringify({ error: "Failed to save configuration" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET(req) {
  try {
    const filePath = path.join(process.cwd(), "public", "agent-selection.json");
    
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ configs: [] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const fileContent = fs.readFileSync(filePath, "utf8");
    const configs = JSON.parse(fileContent);
    
    return new Response(JSON.stringify({ configs }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching configurations:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch configurations" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}