// import { exec } from 'child_process';
// import { NextRequest, NextResponse } from 'next/server';
// import path from 'path';

// export async function POST(req: NextRequest) {
//   try {
//     const { url, language } = await req.json();
//     const scriptPath = path.join(process.cwd(), 'libraries', 'engine.py');
//     const pythonPath = path.join(process.cwd(), 'venv', 'Scripts', 'python.exe');

//     return new Promise((resolve) => {
//       exec(`"${pythonPath}" "${scriptPath}" "${url}", ${language}, { encoding: 'utf8' }`, (error, stdout, stderr) => {
//         if (error) {
//           console.error("Python Error:", stderr);
//           const message = stderr.includes("429") ? "Quota exceeded. Try again in a minute." : "Generation failed.";
//           resolve(NextResponse.json({ error: message }, { status: 500 }));
//           return;
//         }
//         resolve(NextResponse.json({ prompt: stdout.trim() }));
//       });
//     });
//   } catch (err) {
//     return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//   }
// }



import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { url, language } = await req.json();

    const scriptPath = path.join(process.cwd(), "libraries", "engine.py");
    const pythonPath = "python3"; // IMPORTANT for Vercel

    const result = await new Promise<string>((resolve, reject) => {
      exec(
        `"${pythonPath}" "${scriptPath}" "${url}" "${language}"`,
        { encoding: "utf8" },
        (error, stdout, stderr) => {
          if (error) {
            console.error(stderr);
            reject(error);
            return;
          }
          resolve(stdout);
        }
      );
    });

    return NextResponse.json({
      prompt: result.trim(),
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Generation failed" },
      { status: 500 }
    );
  }
}
