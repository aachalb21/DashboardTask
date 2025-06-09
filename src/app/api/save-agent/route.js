import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    // console.log("Received agent config:", body);

    // Path to the agent-selection.json file in public folder
    const filePath = path.join(process.cwd(), "public", "agent-selection.json");
    
    let users = [];
    
    // Read existing users if file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      users = JSON.parse(fileContent);
    }
    
    // Add new user to existing array
    users.push(body);
    
    // Replace the entire file with the updated array
    fs.writeFileSync(filePath, JSON.stringify(body));

    return new Response(JSON.stringify({ 
      message: "User saved successfully!", 
      user: body 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return new Response(JSON.stringify({ error: "Failed to save user config" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET(req) {
  try {
    // Path to the agent-selection.json file in public folder
    const filePath = path.join(process.cwd(), "public", "agent-selection.json");
    
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ users: [] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const fileContent = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(fileContent);
    
    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}