import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getSessionConfig} from "./user.ts";
import {get, post} from "./index.ts";

export type ChatForm = {
	chat_name: string;
};

export type Chat = {
	chat_id: number;
	chat_name: string;
};

export type MessageForm = {
	message: string;
};

export type Message = {
	message_id: number;
	chat_id: number;
	message: string;
	message_type: string;
	message_from: number;
};

const CHAT_QUERY_KEY = 'chat';
const MESSAGE_QUERY_KEY = 'message';

export async function getChat() {
	return useQuery({
		queryKey: [CHAT_QUERY_KEY],
		queryFn: async () => {
			const session = await getSessionConfig();
			if (!session) return;
			const res = await get(`/chat`, session);
			return res.data as Chat;
		}
	});
}

export async function createChat(data: ChatForm) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			const session = await getSessionConfig();
			if (!session) return;
			const res = await post("/chat", data, session);
			return res.data as Chat;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: [CHAT_QUERY_KEY]});
		}
	});
}

export async function getMessages(chat_id: number) {
	return useQuery({
		queryKey: [MESSAGE_QUERY_KEY, chat_id],
		queryFn: async () => {
			const session = await getSessionConfig();
			if (!session) return;
			const res = await get(`/chat/${chat_id}`, session);
			return res.data as Message[];
		}
	})
}

export async function createMessages(chat_id: number, data: MessageForm) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			const session = await getSessionConfig();
			if (!session) return;
			const res = await post(`/chat/${chat_id}`, data, session);
			return res.data as Message;
		},
		onSuccess: (data) => {
			queryClient.setQueryData([MESSAGE_QUERY_KEY, chat_id], (old: Message[] | undefined) => {
				return old ? [...old, data] : [data];
			});
		}
	});
}
