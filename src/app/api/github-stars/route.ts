import {NextResponse} from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.github.com/repos/HiRunOSS/shotzly", {
      headers: {Accept: "application/vnd.github+json"},
      next: {revalidate: 3600},
    });
    if (!response.ok) throw new Error("GitHub request failed");

    const data = await response.json();
    if (typeof data.stargazers_count !== "number") throw new Error("Missing star count");

    return NextResponse.json(
      {stars: data.stargazers_count},
      {headers: {"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"}},
    );
  } catch {
    return NextResponse.json({error: "Star count unavailable"}, {status: 503});
  }
}
