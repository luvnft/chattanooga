import { CreateVideoForm } from "@/components/create-video-form";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { SignInButton } from "@/components/sign-in-button";

export const revalidate = 0;

export type Video = {
	id: number;
	created_at: string;
	name: string;
	description: string;
	video_url: string;
	author: string;
};

async function fetchData(): Promise<Video[]> {
	try {
		const supabase = createClient();
		const { data, error } = await supabase
			.from("videos")
			.select("*")
			.order("id", { ascending: false });
		return data as Video[];
	} catch (error) {
		console.log(error);
		return [];
	}
}

export default async function Home() {
	const data = await fetchData();
	const supabase = createClient();
	const { data: userData, error } = await supabase.auth.getUser();

	console.log(data);

	return (
		<main className="flex min-h-screen flex-col items-center justify-start py-24 gap-12">
			<div className="flex flex-col gap-2 text-center">
				<h1 className="bg-cover bg-top bg-clip-text bg-[url('/bg.webp')] text-transparent scroll-m-20 lg:text-9xl md:text-8xl text-6xl font-extrabold tracking-tight">
					Chattanooga
				</h1>
				<h2 className="lg:text-7xl md:text-6xl text-4xl font-extrabold">
					Video Wall
				</h2>
				<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
					Share your favorite moments from Chattanooga, TN
				</h4>
			</div>
			{error || !userData.user ? <SignInButton /> : <CreateVideoForm />}
			{data.length === 0 && <h3>No videos yet!</h3>}
			{data.map((item: Video) => (
				<Card
					className="overflow-hidden max-w-[350px] sm:max-w-[500px]"
					key={item.id}
				>
					<video
						className=" h-auto w-full object-cover"
						playsInline
						controls
						autoPlay
						loop
						muted
						preload="metadata"
					>
						<source src={item.video_url} type="video/quicktime"/>
						<track kind="captions" src="" label="English" />
					</video>
					<div className="p-2 flex flex-col">
						<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
							{item.name}
						</h3>
						<p>by {item.author}</p>
						<p className="mt-2">{item.description}</p>
					</div>
				</Card>
			))}
		</main>
	);
}
