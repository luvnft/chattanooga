"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createClient } from "@/lib/supabase/client";
import { pinata } from "@/lib/pinata";

const formSchema = z.object({
	name: z.string(),
	description: z.string(),
	file: z.any(),
});

export function CreateVideoForm() {
	const supabase = createClient();

	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			file: "",
		},
	});

	const fileRef = form.register("file");

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const file: File | null = values.file ? values.file[0] : null;
		const { data: userData, error } = await supabase.auth.getUser();
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (file && session) {
			const keyRequest = await fetch("/api/key", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			});
			const keys = await keyRequest.json();
			const { cid } = await pinata.upload
				.file(file)
				.key(keys.JWT)
				.group(`${process.env.NEXT_PUBLIC_GROUP_ID}`);
			const data = new FormData();
			data.append("name", values.name);
			data.append("description", values.description);
			data.append(
				"video_url",
				`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${cid}`,
			);
			const createVideoRequest = await fetch("/api/video", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
				body: data,
			});
			const createVideo = await createVideoRequest.json();
			console.log(createVideo);
			setIsLoading(false);
			setOpen(false);
			router.refresh();
			form.reset();
		} else {
			console.log("no file selected");
			setIsLoading(false);
		}
	}

	function ButtonLoading() {
		return (
			<Button disabled>
				<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				Uploading...
			</Button>
		);
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Button>Create Video</Button>
			</DialogTrigger>

			<DialogContent className="max-w-[350px] sm:max-w-[500px]">
				<DialogTitle>Create a Video</DialogTitle>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Walnut St Bridge" {...field} />
									</FormControl>
									<FormDescription>
										What's the title of your video?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											placeholder="A nice walk across the bridge to Coolidge Park"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Give your video a description
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="file"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Video File</FormLabel>
									<FormControl>
										<Input type="file" {...fileRef} />
									</FormControl>
									<FormDescription>Select your video file</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isLoading ? (
							ButtonLoading()
						) : (
							<Button type="submit">Submit</Button>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
