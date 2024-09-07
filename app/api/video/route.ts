import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
	const supabase = createClient();
	try {
		const token = request.headers.get("authorization")?.split("Bearer ")[1];
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser(token);
		console.log(user);
		if (authError) {
			console.log(authError);
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 },
			);
		}
		const formData = await request.formData();
		const name = formData.get("name");
		const description = formData.get("description");
		const videoUrl = formData.get("video_url");
		const author =
			user?.identities &&
			user?.identities.length > 0 &&
			user?.identities[0].identity_data?.full_name;
		const { data, error } = await supabase
			.from("videos")
			.insert({
				name: name,
				description: description,
				video_url: videoUrl,
				author: author,
			})
			.select();
		console.log(data);
		if (error) {
			console.log(error);
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 },
			);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
